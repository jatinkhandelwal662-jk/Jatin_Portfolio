#!/usr/bin/env python3
"""
Hero video processing pipeline for personal portfolio.
Converts input intro video into seamless looping hero.mp4 and hero.webm,
and exports portrait-bust.webp and og.jpg.
"""

import os
import sys
import subprocess
import wave
import numpy as np

# Ensure ffmpeg binary is located
try:
    import imageio_ffmpeg
    FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()
except ImportError:
    FFMPEG = "ffmpeg"

def run_cmd(cmd):
    print(f"[CMD] {' '.join(cmd)}")
    res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    if res.returncode != 0:
        print(f"Error executing command:\n{res.stderr}")
        raise RuntimeError(f"FFmpeg failed with exit code {res.returncode}")
    return res

def main():
    src_video = "port-folio/Character_speaking_introduction_e9532e50_1080p.mp4"
    if not os.path.exists(src_video):
        # Fallback to local search
        for f in os.listdir("port-folio"):
            if f.endswith(".mp4") or f.endswith(".mov"):
                src_video = os.path.join("port-folio", f)
                break

    print(f"Using source video: {src_video}")
    os.makedirs("public/hero", exist_ok=True)
    os.makedirs("temp_build", exist_ok=True)

    # 1. Export Portrait Still and OG Image
    print("Generating portrait-bust.webp (480x600) and og.jpg (1200x630)...")
    bust_path = "public/portrait-bust.webp"
    run_cmd([
        FFMPEG, "-y", "-ss", "00:00:02", "-i", src_video,
        "-vf", "crop=480:600:720:50,colorlevels=rimax=0.98:gimax=0.98:bimax=0.98",
        "-vframes", "1", bust_path
    ])

    og_path = "public/og.jpg"
    # Create 1200x630 OG image with clean off-white background and centered bust on right
    run_cmd([
        FFMPEG, "-y", "-ss", "00:00:02", "-i", src_video,
        "-vf", "crop=800:1000:560:50,scale=504:630,pad=1200:630:580:0:color=#f4f2ee,colorlevels=rimax=0.98:gimax=0.98:bimax=0.98",
        "-vframes", "1", og_path
    ])

    # 2. Extract Audio for Sample-Accurate NumPy Crossfade
    # Video duration is 10.0s.
    # Segment A: 0.5s -> 10.0s (9.5s)
    # Segment B: 0.0s -> 0.5s (0.5s)
    # In output, crossfade occurs at the end (from 9.0s to 9.5s) between A's tail (9.5-10.0) and B's head (0.0-0.5).
    raw_audio = "temp_build/raw_audio.wav"
    run_cmd([
        FFMPEG, "-y", "-i", src_video,
        "-t", "10.0", "-vn", "-ac", "2", "-ar", "48000", raw_audio
    ])

    with wave.open(raw_audio, "rb") as wf:
        nchannels = wf.getnchannels()
        sampwidth = wf.getsampwidth()
        framerate = wf.getframerate()
        nframes = wf.getnframes()
        audio_bytes = wf.readframes(nframes)

    samples = np.frombuffer(audio_bytes, dtype=np.int16).reshape(-1, nchannels).astype(np.float32)

    # Calculate frame counts
    # Total duration = 10.0s = 480,000 samples
    fade_len = int(0.5 * framerate) # 24000 samples
    start_offset = fade_len # 0.5s

    # Segment A: from t=0.5 to t=10.0 (samples 24000 to 480000) -> 456000 samples
    seg_A = samples[start_offset:int(10.0 * framerate)]
    # Segment B: from t=0.0 to t=0.5 (samples 0 to 24000) -> 24000 samples
    seg_B = samples[0:fade_len]

    # Target output length is len(seg_A) = 456000 samples (9.5s)
    out_audio = np.copy(seg_A)
    # Cross-fade in the last fade_len samples of out_audio (sample 432000 to 456000)
    fade_in = np.linspace(0.0, 1.0, fade_len)[:, np.newaxis]
    fade_out = 1.0 - fade_in

    tail_start = len(out_audio) - fade_len
    out_audio[tail_start:] = out_audio[tail_start:] * fade_out + seg_B[:fade_len] * fade_in

    # Convert back to int16
    out_audio_int16 = np.clip(out_audio, -32768, 32767).astype(np.int16)
    looped_audio = "temp_build/looped_audio.wav"
    with wave.open(looped_audio, "wb") as wf:
        wf.setnchannels(nchannels)
        wf.setsampwidth(sampwidth)
        wf.setframerate(framerate)
        wf.writeframes(out_audio_int16.tobytes())

    print("Looped audio generated successfully with sample-accurate crossfade.")

    # 3. Process Video with FFmpeg xfade
    # Stream A: from 0.5s to 10.0s (duration 9.5s)
    # Stream B: from 0.0s to 0.5s (duration 0.5s)
    # xfade transition=fade:duration=0.5:offset=9.0
    # Cropping to 800:1000:560:50, scaled to 768:960, whitened with colorlevels
    filter_complex = (
        "[0:v]trim=start=0.5:end=10.0,setpts=PTS-STARTPTS,fps=24,crop=800:1000:560:50,scale=768:960,colorlevels=rimax=0.98:gimax=0.98:bimax=0.98[vA];"
        "[0:v]trim=start=0.0:end=0.5,setpts=PTS-STARTPTS,fps=24,crop=800:1000:560:50,scale=768:960,colorlevels=rimax=0.98:gimax=0.98:bimax=0.98[vB];"
        "[vA][vB]xfade=transition=fade:duration=0.5:offset=9.0,format=yuv420p[v_out]"
    )

    looped_video = "temp_build/looped_video.mp4"
    run_cmd([
        FFMPEG, "-y", "-i", src_video,
        "-filter_complex", filter_complex,
        "-map", "[v_out]",
        "-c:v", "libx264", "-crf", "18", "-preset", "fast",
        looped_video
    ])

    print("Looped video stream generated successfully.")

    # 4. Export hero.mp4: H.264 yuv420p (CRF 24, -preset slow), AAC 96k, +faststart
    print("Muxing public/hero/hero.mp4...")
    run_cmd([
        FFMPEG, "-y",
        "-i", looped_video,
        "-i", looped_audio,
        "-c:v", "libx264", "-crf", "24", "-preset", "slow", "-pix_fmt", "yuv420p",
        "-c:a", "aac", "-b:a", "96k",
        "-movflags", "+faststart",
        "-shortest",
        "public/hero/hero.mp4"
    ])

    # 5. Export hero.webm: VP9 (CRF 36), Opus 80k
    print("Muxing public/hero/hero.webm...")
    run_cmd([
        FFMPEG, "-y",
        "-i", looped_video,
        "-i", looped_audio,
        "-c:v", "libvpx-vp9", "-crf", "36", "-b:v", "0",
        "-c:a", "libopus", "-b:a", "80k",
        "-shortest",
        "public/hero/hero.webm"
    ])

    print("Hero assets successfully built in public/hero/ and public/!")

if __name__ == "__main__":
    main()
