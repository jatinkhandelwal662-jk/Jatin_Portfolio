"use client";

import {
  createAvatar,
  type AvatarController,
} from "@bible-strong/avatar-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import novaAvatar from "@/lib/nova-avatar.json";
import { PROFILE, PROJECTS, SKILLS } from "@/lib/data";

const NovaAvatar = createAvatar(novaAvatar);
type NovaAnimation = keyof typeof novaAvatar.animations;
type NovaExpression = keyof typeof novaAvatar.expressions;
type CursorQuadrant = "top-left" | "top-right" | "bottom-left" | "bottom-right";

const IDLE_TIMEOUT_MS = 10_000;
const BUBBLE_DURATION_MS = 5_000;
const INTERACTION_HOLD_MS = 3_000;
const ROAM_INTERVAL_MS = 8_000;
const interactiveSelector =
  "[data-nova-cta], a, button, [role='button']";
type RoamPosition = "bottom-right" | "top-right" | "top-left" | "bottom-left";
const roamPositions: RoamPosition[] = [
  "bottom-right",
  "top-right",
  "top-left",
  "bottom-left",
];
const cursorExpressions: Record<CursorQuadrant, NovaExpression> = {
  "top-left": "asymmetric-up-left",
  "top-right": "upward-side-glance",
  "bottom-left": "wide-down-left",
  "bottom-right": "joyful-down-right",
};

function getPrimaryCta(target: EventTarget | null) {
  if (!(target instanceof Element)) return null;

  const element =
    target.closest<HTMLElement>("[data-nova-cta]") ??
    target.closest<HTMLElement>(interactiveSelector);
  if (!element) return null;

  const label = [
    element.innerText,
    element.getAttribute("aria-label"),
    element.getAttribute("title"),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  const href = element.getAttribute("href")?.toLowerCase() ?? "";
  const isPrimary =
    element.hasAttribute("data-nova-cta") ||
    /\b(view project|project:|contact|start a conversation|let'?s talk|explore my work|view my work|live app)\b/.test(
      label
    ) ||
    href.includes("#contact") ||
    href.includes("/inquiry");

  return isPrimary ? { element, label } : null;
}

function isEditableTarget(
  target: EventTarget | null
): target is HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement {
  return (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement
  );
}

type AssistantMessage = {
  id: number;
  role: "assistant" | "visitor";
  text: string;
  suggestions?: string[];
  action?: {
    label: string;
    href: string;
  };
};

type AssistantReply = Omit<AssistantMessage, "id" | "role">;

const suggestedQuestions = [
  "What projects has Jatin built?",
  "What technologies does he use?",
  "How can I contact him?",
];

function getRelatedQuestions(question: string) {
  const query = question.toLowerCase();

  if (/\b(project|projects|portfolio|work|built|build)\b/.test(query)) {
    return [
      "What technologies did Jatin use in his projects?",
      "Can I see Jatin's GitHub?",
      "How can I contact Jatin?",
    ];
  }

  if (/\b(skills?|tech(?:nology|nologies)?|stack|tools|languages)\b/.test(query)) {
    return [
      "Which projects use these technologies?",
      "What is Jatin currently studying?",
      "Can I see his GitHub?",
    ];
  }

  if (/\b(contact|reach|hire|email)\b/.test(query)) {
    return [
      "How can I start a conversation?",
      "Can I download Jatin's résumé?",
      "What projects has Jatin built?",
    ];
  }

  if (/\b(resume|résumé|cv)\b/.test(query)) {
    return [
      "What projects has Jatin built?",
      "What technologies does he use?",
      "How can I contact him?",
    ];
  }

  if (/\b(education|study|college|university|degree|student)\b/.test(query)) {
    return [
      "What projects has Jatin built?",
      "What achievements has he earned?",
      "What technologies does he use?",
    ];
  }

  if (/\b(award|achievement|hackathon|top 30|certificate of merit)\b/.test(query)) {
    return [
      "What projects has Jatin built?",
      "Where is Jatin studying?",
      "How can I contact him?",
    ];
  }

  return suggestedQuestions;
}

function getReplyAnimation(question: string): NovaAnimation {
  const query = question.toLowerCase();

  if (/\b(award|achievement|hackathon|top 30|certificate of merit)\b/.test(query)) {
    return "proud";
  }

  if (/\b(project|projects|portfolio|work|built|build)\b/.test(query)) {
    return "excited";
  }

  if (/\b(skills?|tech(?:nology|nologies)?|stack|tools|languages)\b/.test(query)) {
    return "curious";
  }

  return "happy";
}

function getAssistantReply(question: string): AssistantReply {
  const query = question.toLowerCase();

  if (/\b(hi|hello|hey|good morning|good afternoon)\b/.test(query)) {
    return {
      text: `Hi! I'm Nova, ${PROFILE.name}'s portfolio assistant. Ask me about his projects, skills, education, or how to get in touch.`,
    };
  }

  if (/\b(resume|résumé|cv)\b/.test(query)) {
    return {
      text: "You can download Jatin's résumé here.",
      action: {
        label: "Download résumé",
        href: PROFILE.resumePath,
      },
    };
  }

  if (/\bgithub\b/.test(query)) {
    return {
      text: "You can explore Jatin's code and projects on GitHub.",
      action: {
        label: "Open GitHub",
        href: PROFILE.github,
      },
    };
  }

  if (/\blinkedin\b/.test(query)) {
    return {
      text: "You can connect with Jatin on LinkedIn.",
      action: {
        label: "Open LinkedIn",
        href: PROFILE.linkedin,
      },
    };
  }

  if (/\bemail\b/.test(query)) {
    return {
      text: `Email Jatin at ${PROFILE.email}.`,
      action: {
        label: "Send an email",
        href: `mailto:${PROFILE.email}`,
      },
    };
  }

  if (/\b(contact|reach|hire)\b/.test(query)) {
    return {
      text: `You can reach Jatin at ${PROFILE.email}, or connect with him on GitHub and LinkedIn.`,
      action: {
        label: "Go to contact",
        href: "#contact",
      },
    };
  }

  if (
    /\b(project|projects|portfolio|work|built|build|sudarshan|setu|s\.e\.t\.u)\b/.test(
      query
    )
  ) {
    const normalizedQuery = query.replace(/[^a-z0-9]/g, "");
    const project = PROJECTS.find((item) =>
      normalizedQuery.includes(item.title.toLowerCase().replace(/[^a-z0-9]/g, ""))
    );

    return {
      text: project
        ? `${project.title}: ${project.description}`
        : `Jatin's featured projects are ${PROJECTS.map((item) => item.title).join(" and ")}. They cover voice-first civic technology and satellite-road analysis.`,
      action: {
        label: project ? "Explore selected work" : "See all projects",
        href: "#work",
      },
    };
  }

  if (/\b(skills?|tech(?:nology|nologies)?|stack|tools|languages)\b/.test(query)) {
    const keySkills = SKILLS.filter((skill) =>
      ["JavaScript", "Python", "Node.js", "Express.js", "FastAPI", "PyTorch"].includes(
        skill.name
      )
    );

    return {
      text: `Jatin works with ${keySkills.map((skill) => skill.name).join(", ")}, along with web, backend, and geospatial tools.`,
      action: {
        label: "Browse skills",
        href: "#skills",
      },
    };
  }

  if (/\b(education|study|college|university|degree|student)\b/.test(query)) {
    return {
      text: `Jatin is studying ${PROFILE.dept} at GGSIPU USAR in ${PROFILE.location}.`,
      action: {
        label: "Read about Jatin",
        href: "#about",
      },
    };
  }

  if (/\b(award|achievement|hackathon|top 30|certificate of merit)\b/.test(query)) {
    return {
      text: "Jatin's portfolio includes hackathon work and achievements, including a Top 30 finish at Hack4Delhi 2026.",
      action: {
        label: "View achievements",
        href: "#achievements",
      },
    };
  }

  if (/\b(where|location|based|city)\b/.test(query)) {
    return {
      text: `Jatin is based in ${PROFILE.location}.`,
      action: {
        label: "Contact Jatin",
        href: "#contact",
      },
    };
  }

  if (/\b(about|who|jatin|background|experience|internship|collaborat)\b/.test(query)) {
    return {
      text: `${PROFILE.name} is a ${PROFILE.role.toLowerCase()} and ${PROFILE.resumeSummary}`,
      action: {
        label: "Read the introduction",
        href: "#about",
      },
    };
  }

  return {
    text: "I can help with questions about Jatin's projects, skills, education, achievements, résumé, or contact details. Try one of the suggestions below.",
  };
}

export function InteractiveAvatar() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const [roamPosition, setRoamPosition] =
    useState<RoamPosition>("bottom-right");
  const [roamOffset, setRoamOffset] = useState({ x: 0, y: 0 });
  const [bubbleText, setBubbleText] = useState(
    `Hi, I'm Nova! Ask me about ${PROFILE.name}'s portfolio.`
  );
  const [isBubbleVisible, setIsBubbleVisible] = useState(true);
  const [bubbleVersion, setBubbleVersion] = useState(0);
  const [messages, setMessages] = useState<AssistantMessage[]>([
    {
      id: 0,
      role: "assistant",
      text: `Hi! I'm Nova, ${PROFILE.name}'s portfolio assistant. What would you like to know?`,
      suggestions: suggestedQuestions,
    },
  ]);
  const widgetRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<AvatarController>(null);
  const nextMessageId = useRef(1);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const bubbleTimeoutRef = useRef<number | null>(null);
  const replyTimeoutRef = useRef<number | null>(null);
  const isReplyingRef = useRef(false);
  const isWidgetHoveredRef = useRef(false);
  const roamPositionRef = useRef<RoamPosition>("bottom-right");
  const interactionLockRef = useRef(0);
  const isSleepingRef = useRef(false);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const showBubble = useCallback(
    (message: string, duration = BUBBLE_DURATION_MS) => {
      if (bubbleTimeoutRef.current !== null) {
        window.clearTimeout(bubbleTimeoutRef.current);
      }

      setBubbleText(message);
      setBubbleVersion((version) => version + 1);
      setIsBubbleVisible(true);
      bubbleTimeoutRef.current = window.setTimeout(() => {
        setIsBubbleVisible(false);
      }, duration);
    },
    []
  );

  const playAnimation = useCallback((animation: NovaAnimation) => {
    const result = avatarRef.current?.play(animation);
    if (result?.ok) {
      isSleepingRef.current = animation === "sleeping" || animation === "drowsy";
    }
    return result?.ok ?? false;
  }, []);

  const reactToInteraction = useCallback(
    (animation: NovaAnimation, message: string, duration?: number) => {
      interactionLockRef.current = Date.now() + INTERACTION_HOLD_MS;
      playAnimation(animation);
      showBubble(message, duration);
    },
    [playAnimation, showBubble]
  );

  const moveMascotTo = useCallback((position: RoamPosition) => {
    roamPositionRef.current = position;
    setRoamPosition(position);

    const widget = widgetRef.current;
    if (!widget) {
      setRoamOffset({ x: 0, y: 0 });
      return;
    }

    const margin = window.innerWidth >= 640 ? 24 : 16;
    const topMargin = window.innerWidth >= 640 ? 112 : 88;
    const viewportWidth = document.documentElement.clientWidth;
    const viewportHeight = document.documentElement.clientHeight;
    const { right, bottom } = window.getComputedStyle(widget);
    const baseLeft =
      viewportWidth - widget.offsetWidth - (Number.parseFloat(right) || 0);
    const baseTop =
      viewportHeight - widget.offsetHeight - (Number.parseFloat(bottom) || 0);
    const targetTop = Math.min(
      topMargin,
      Math.max(margin, viewportHeight - widget.offsetHeight - margin)
    );
    setRoamOffset({
      x: position.endsWith("left") ? margin - baseLeft : 0,
      y: position.startsWith("top") ? targetTop - baseTop : 0,
    });
  }, []);

  useEffect(() => {
    if (isOpen || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const interval = window.setInterval(() => {
      if (
        document.visibilityState !== "visible" ||
        isWidgetHoveredRef.current
      ) {
        return;
      }

      const currentIndex = roamPositions.indexOf(roamPositionRef.current);
      const nextPosition = roamPositions[(currentIndex + 1) % roamPositions.length];
      moveMascotTo(nextPosition);
    }, ROAM_INTERVAL_MS);

    const handleResize = () => moveMascotTo(roamPositionRef.current);
    window.addEventListener("resize", handleResize);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("resize", handleResize);
    };
  }, [isOpen, moveMascotTo]);

  useEffect(
    () => () => {
      if (replyTimeoutRef.current !== null) {
        window.clearTimeout(replyTimeoutRef.current);
      }
    },
    []
  );

  useEffect(() => {
    let idleTimer = 0;
    let pointerFrame = 0;
    let pendingPointer: { x: number; y: number } | null = null;
    let lastQuadrant = "";
    let lastCta: HTMLElement | null = null;
    const invalidFields = new WeakSet<Element>();
    const alertMessages = new WeakMap<HTMLElement, string>();

    const scheduleIdle = () => {
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => {
        const sleeping = avatarRef.current?.play("sleeping");
        if (sleeping && !sleeping.ok) {
          avatarRef.current?.play("drowsy");
        }
        isSleepingRef.current = true;
        showBubble("Taking a little breather. I'm here when you need me.", 4_500);
      }, IDLE_TIMEOUT_MS);
    };

    const handleActivity = () => {
      scheduleIdle();
      if (isSleepingRef.current) {
        isSleepingRef.current = false;
        setIsBubbleVisible(false);
        playAnimation("waking");
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      handleActivity();
      pendingPointer = { x: event.clientX, y: event.clientY };
      if (pointerFrame) return;

      pointerFrame = window.requestAnimationFrame(() => {
        pointerFrame = 0;
        if (!pendingPointer || Date.now() < interactionLockRef.current) return;

        const isLeft = pendingPointer.x < window.innerWidth / 2;
        const isTop = pendingPointer.y < window.innerHeight / 2;
        const quadrant: CursorQuadrant = `${isTop ? "top" : "bottom"}-${isLeft ? "left" : "right"}`;
        if (quadrant === lastQuadrant) return;
        lastQuadrant = quadrant;

        avatarRef.current?.setExpression(cursorExpressions[quadrant]);
      });
    };

    const isInsideCta = (
      element: HTMLElement,
      relatedTarget: EventTarget | null
    ) => relatedTarget instanceof Node && element.contains(relatedTarget);

    const activateCta = (
      target: EventTarget | null,
      relatedTarget: EventTarget | null
    ) => {
      const cta = getPrimaryCta(target);
      if (
        !cta ||
        isInsideCta(cta.element, relatedTarget) ||
        lastCta === cta.element
      ) {
        return;
      }

      lastCta = cta.element;
      const isContact =
        /\b(contact|conversation|talk|inquiry)\b/.test(cta.label) ||
        cta.element.getAttribute("href")?.includes("/inquiry") ||
        cta.element.getAttribute("href")?.includes("#contact");
      reactToInteraction(
        isContact ? "celebrate" : "excited",
        "Ooh, great choice!"
      );
    };

    const handlePointerOver = (event: PointerEvent) => {
      handleActivity();
      activateCta(event.target, event.relatedTarget);
    };

    const handlePointerOut = (event: PointerEvent) => {
      const cta = getPrimaryCta(event.target);
      if (cta && !isInsideCta(cta.element, event.relatedTarget)) {
        lastCta = null;
      }
    };

    const handleFocusIn = (event: FocusEvent) => {
      handleActivity();
      if (isEditableTarget(event.target)) {
        if (invalidFields.has(event.target)) {
          const invalidEmail =
            event.target instanceof HTMLInputElement &&
            event.target.type === "email" &&
            Boolean(event.target.value);
          reactToInteraction(
            invalidEmail ? "confused" : "suspicious",
            invalidEmail
              ? "That email doesn't look quite right. Could you check it?"
              : "Something needs a quick fix. Check the highlighted field."
          );
        } else if (event.target.id === "portfolio-assistant-input") {
          reactToInteraction("listening", "I'm listening! Ask me anything.");
        } else {
          reactToInteraction("working", "Let's get this typed out!");
        }
        return;
      }

      activateCta(event.target, null);
    };

    const handleFocusOut = (event: FocusEvent) => {
      const cta = getPrimaryCta(event.target);
      if (cta && !isInsideCta(cta.element, event.relatedTarget)) {
        lastCta = null;
      }
    };

    const handleInput = (event: Event) => {
      handleActivity();
      const target = event.target;
      if (!isEditableTarget(target)) return;

      if (target instanceof HTMLInputElement && target.type === "email") {
        if (target.value && !target.validity.valid) {
          if (invalidFields.has(target)) return;
          invalidFields.add(target);
          reactToInteraction(
            "confused",
            "That email doesn't look quite right. Could you check it?"
          );
        } else {
          invalidFields.delete(target);
        }
        return;
      }

      if (invalidFields.has(target) && !target.validity.valid) {
        reactToInteraction(
          "suspicious",
          "Something needs a quick fix. Check the highlighted field."
        );
      } else if (target.validity.valid) {
        invalidFields.delete(target);
      }
    };

    const handleInvalid = (event: Event) => {
      const target = event.target;
      if (target instanceof Element) invalidFields.add(target);
      if (target instanceof HTMLInputElement && target.type === "email") {
        if (target.value) {
          invalidFields.add(target);
          reactToInteraction(
            "confused",
            "That email doesn't look quite right. Could you check it?"
          );
        } else if (!target.value) {
          reactToInteraction(
            "suspicious",
            "Something needs a quick fix. Check the highlighted field."
          );
        }
        return;
      }

      const invalidEmail = document.querySelector<HTMLInputElement>(
        'input[type="email"]:invalid'
      );
      if (invalidEmail?.value) return;

      reactToInteraction(
        "suspicious",
        "Something needs a quick fix. Check the highlighted field."
      );
    };

    const handleFormAlert = (alert: HTMLElement) => {
      const message = alert.textContent?.trim() ?? "";
      if (!message || alertMessages.get(alert) === message) return;
      alertMessages.set(alert, message);
      reactToInteraction(
        "suspicious",
        "That didn't go through. Please review the form and try again."
      );
    };

    const inspectAddedNode = (node: Node) => {
      if (!(node instanceof Element)) {
        const alert = node.parentElement?.closest<HTMLElement>('[role="alert"]');
        if (alert?.closest("form")) handleFormAlert(alert);
        return;
      }

      if (
        node instanceof HTMLElement &&
        node.matches('[role="alert"]') &&
        node.closest("form")
      ) {
        handleFormAlert(node);
      }
      node
        .querySelectorAll<HTMLElement>('[role="alert"]')
        .forEach((alert) => {
          if (alert.closest("form")) handleFormAlert(alert);
        });
    };

    const alertObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "characterData") {
          inspectAddedNode(mutation.target);
        } else {
          mutation.addedNodes.forEach(inspectAddedNode);
        }
      });
    });

    alertObserver.observe(document.body, {
      childList: true,
      characterData: true,
      subtree: true,
    });
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerover", handlePointerOver, true);
    window.addEventListener("pointerout", handlePointerOut, true);
    window.addEventListener("focusin", handleFocusIn, true);
    window.addEventListener("focusout", handleFocusOut, true);
    window.addEventListener("input", handleInput, true);
    window.addEventListener("invalid", handleInvalid, true);
    window.addEventListener("scroll", handleActivity, { passive: true });
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("touchstart", handleActivity, { passive: true });
    scheduleIdle();

    return () => {
      window.clearTimeout(idleTimer);
      window.cancelAnimationFrame(pointerFrame);
      alertObserver.disconnect();
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerover", handlePointerOver, true);
      window.removeEventListener("pointerout", handlePointerOut, true);
      window.removeEventListener("focusin", handleFocusIn, true);
      window.removeEventListener("focusout", handleFocusOut, true);
      window.removeEventListener("input", handleInput, true);
      window.removeEventListener("invalid", handleInvalid, true);
      window.removeEventListener("scroll", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("touchstart", handleActivity);
    };
  }, [playAnimation, reactToInteraction, showBubble]);

  useEffect(() => {
    bubbleTimeoutRef.current = window.setTimeout(() => {
      setIsBubbleVisible(false);
    }, 7_000);
    return () => {
      if (bubbleTimeoutRef.current !== null) {
        window.clearTimeout(bubbleTimeoutRef.current);
      }
    };
  }, [showBubble]);

  const toggleAssistant = () => {
    if (isOpen) {
      setIsOpen(false);
      showBubble("I'm right here if you need help.");
      playAnimation("idle");
    } else {
      moveMascotTo("bottom-right");
      setIsOpen(true);
      setIsBubbleVisible(false);
      playAnimation("listening");
    }
  };

  const sendMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isReplyingRef.current) return;

    const reply = getAssistantReply(trimmed);
    reply.suggestions = getRelatedQuestions(trimmed);
    const messageId = nextMessageId.current;
    nextMessageId.current += 2;
    setMessages((current) => [
      ...current,
      { id: messageId, role: "visitor", text: trimmed },
    ]);
    setInput("");
    isReplyingRef.current = true;
    setIsReplying(true);
    playAnimation("thinking");
    replyTimeoutRef.current = window.setTimeout(() => {
      setMessages((current) => [
        ...current,
        { id: messageId + 1, role: "assistant", ...reply },
      ]);
      isReplyingRef.current = false;
      setIsReplying(false);
      replyTimeoutRef.current = null;
      playAnimation(getReplyAnimation(trimmed));
    }, 550);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendMessage(input);
  };
  const latestAssistantMessageId = [...messages]
    .reverse()
    .find((message) => message.role === "assistant")?.id;

  return (
    <div
      ref={widgetRef}
      onPointerEnter={(event) => {
        if (event.pointerType !== "touch") isWidgetHoveredRef.current = true;
      }}
      onPointerLeave={() => {
        isWidgetHoveredRef.current = false;
      }}
      className="fixed bottom-4 right-4 z-[80] flex flex-col items-end gap-3 transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none sm:bottom-6 sm:right-6"
      style={{ transform: `translate3d(${roamOffset.x}px, ${roamOffset.y}px, 0)` }}
    >
      {isOpen && (
        <section
          id="portfolio-assistant-panel"
          role="dialog"
          aria-label="Nova, Jatin's portfolio assistant"
          className="flex h-[min(580px,calc(100dvh-120px))] w-[min(380px,calc(100vw-48px))] flex-col overflow-hidden rounded-[26px] border border-[#171512]/10 bg-[#fffdf8] shadow-[0_24px_80px_-24px_rgba(23,21,18,0.35)]"
        >
          <header className="flex items-center justify-between border-b border-[#171512]/[0.08] bg-[#faf4df] px-4 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-[#171512]">
                  Nova
                </span>
                <span className="mt-0.5 flex items-center gap-1.5 text-[11px] text-[#77756f]">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Portfolio assistant · Ready to help
                </span>
              </span>
            </div>
            <button
              type="button"
              onClick={toggleAssistant}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-lg text-[#77756f] transition-colors hover:bg-white hover:text-[#171512]"
              aria-label="Close Nova assistant"
            >
              ×
            </button>
          </header>

          <div
            className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
            role="log"
            aria-live="polite"
            aria-relevant="additions"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex flex-col ${message.role === "visitor" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                    message.role === "visitor"
                      ? "rounded-br-md bg-[#df755d] text-white"
                      : "rounded-bl-md border border-[#171512]/[0.06] bg-white text-[#3a342f]"
                  }`}
                >
                  <p>{message.text}</p>
                  {message.action && (
                    <a
                      href={message.action.href}
                      target={
                        message.action.href.startsWith("http") ? "_blank" : undefined
                      }
                      rel={
                        message.action.href.startsWith("http")
                          ? "noopener noreferrer"
                          : undefined
                      }
                      onClick={() => {
                        if (message.action?.href.startsWith("#")) {
                          toggleAssistant();
                        }
                      }}
                      className="mt-2 inline-flex items-center gap-1 font-semibold text-[#ca634c] underline decoration-[#ca634c]/30 underline-offset-2 hover:decoration-[#ca634c]"
                    >
                      {message.action.label} <span aria-hidden="true">↗</span>
                    </a>
                  )}
                </div>
                {message.role === "assistant" &&
                  message.id === latestAssistantMessageId &&
                  !isReplying &&
                  message.suggestions?.length && (
                    <div
                      className="mt-2 flex max-w-[88%] flex-wrap gap-2"
                      aria-label="Related questions"
                    >
                      {message.suggestions.map((question) => (
                        <button
                          key={question}
                          type="button"
                          onClick={() => sendMessage(question)}
                          className="rounded-full border border-[#171512]/10 bg-white px-3 py-2 text-left text-[11px] leading-snug text-[#5b554c] transition-colors hover:border-[#df755d]/50 hover:text-[#ca634c]"
                        >
                          {question}
                        </button>
                      ))}
                    </div>
                  )}
              </div>
            ))}

            {isReplying && (
              <div
                className="flex justify-start"
                role="status"
                aria-label="Nova is thinking"
              >
                <p className="rounded-2xl rounded-bl-md border border-[#171512]/[0.06] bg-white px-3.5 py-2.5 text-[13px] text-[#77756f]">
                  Nova is thinking…
                </p>
              </div>
            )}

            <div ref={messageEndRef} />
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 border-t border-[#171512]/[0.08] bg-white px-3 py-3"
          >
            <label htmlFor="portfolio-assistant-input" className="sr-only">
              Ask Nova about Jatin&apos;s portfolio
            </label>
            <input
              id="portfolio-assistant-input"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about projects, skills..."
              maxLength={300}
              className="min-w-0 flex-1 rounded-full bg-[#f7f5f0] px-4 py-3 text-sm text-[#171512] outline-none placeholder:text-[#a19a8c] focus:ring-2 focus:ring-[#df755d]/30"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#df755d] text-lg text-white transition-colors hover:bg-[#ca634c] disabled:cursor-not-allowed disabled:bg-[#d9d3c8]"
              aria-label="Send message"
            >
              ↑
            </button>
          </form>
        </section>
      )}

      <div
        className={`flex items-center gap-3 ${
          roamPosition.endsWith("left") ? "flex-row-reverse" : ""
        }`}
      >
        <div
          key={bubbleVersion}
          aria-live="polite"
          aria-atomic="true"
          aria-hidden={isOpen || !isBubbleVisible}
          className={`pointer-events-none relative mb-5 max-w-[min(240px,calc(100vw-128px))] rounded-2xl border border-[#171512]/10 bg-[#f7ffdf] px-4 py-3 text-xs leading-relaxed text-[#302c27] shadow-[0_12px_30px_-14px_rgba(23,21,18,0.35)] transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none ${
            !isOpen && isBubbleVisible
              ? "nova-speech-pop translate-y-0 scale-100 opacity-100"
              : "translate-y-2 scale-95 opacity-0"
          }`}
        >
          <p>{bubbleText}</p>
          <span
            className={`absolute bottom-3 h-3.5 w-3.5 border-[#171512]/10 bg-[#f7ffdf] ${
              roamPosition.endsWith("left")
                ? "-left-2 -rotate-45 border-l border-t"
                : "-right-2 rotate-45 border-r border-b"
            }`}
            aria-hidden="true"
          />
        </div>

        <button
          type="button"
          onClick={toggleAssistant}
          aria-expanded={isOpen}
          aria-controls="portfolio-assistant-panel"
          aria-label={isOpen ? "Close Nova assistant" : "Chat with Nova"}
          className="flex h-[82px] w-[82px] shrink-0 items-center justify-center rounded-full border-[3px] border-white bg-[#edb29a] shadow-[0_12px_34px_-10px_rgba(181,83,61,0.65)] transition-transform hover:scale-105 active:scale-95"
        >
          <NovaAvatar
            ref={avatarRef}
            defaultAnimation="waking"
            size={72}
            ariaLabel="Nova, interactive portfolio assistant"
          />
        </button>
      </div>
    </div>
  );
}
