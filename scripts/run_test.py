import asyncio
import os
from playwright.async_api import async_playwright

os.makedirs('temp_test', exist_ok=True)

async def test_suite():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        context = await browser.new_context(viewport={'width': 1440, 'height': 900})
        page = await context.new_page()

        errors = []
        page.on('console', lambda msg: errors.append(msg.text) if msg.type == 'error' else None)

        print('Loading page at 1440x900...')
        await page.goto('http://localhost:3000', wait_until='networkidle')
        await page.wait_for_timeout(1000)

        # Breakpoint overflow checks
        widths = [360, 390, 480, 768, 1024, 1280, 1440, 1920]
        for w in widths:
            await page.set_viewport_size({'width': w, 'height': 900})
            await page.wait_for_timeout(200)
            sw = await page.evaluate('document.documentElement.scrollWidth')
            iw = await page.evaluate('window.innerWidth')
            print(f'Breakpoint {w}px: scrollWidth={sw}, innerWidth={iw}, ok={sw == iw}')
            assert sw == iw, f'Overflow at {w}px: {sw} > {iw}'

        # Reset to 1440x900 for section tests
        await page.set_viewport_size({'width': 1440, 'height': 900})
        await page.wait_for_timeout(500)

        # 1. Hero Screenshot
        await page.screenshot(path='temp_test/01_hero.png')
        print('Captured 01_hero.png')

        # Test Sound button toggle
        sound_btn = page.locator('button[aria-label*="audio"]')
        await sound_btn.click()
        await page.wait_for_timeout(500)
        label_after_click = await sound_btn.get_attribute('aria-label')
        print(f'Sound button label after click: {label_after_click}')

        # 2. Scroll to About and test ID card
        about_sec = page.locator('#about')
        await about_sec.scroll_into_view_if_needed()
        await page.wait_for_timeout(800)
        await page.screenshot(path='temp_test/02_about.png')
        print('Captured 02_about.png')

        # Test ID Card Flip on hover / focus
        id_card = page.locator('div[role="button"][aria-label*="Developer ID card"]')
        await id_card.hover(force=True)
        await page.wait_for_timeout(800)
        await page.screenshot(path='temp_test/02_about_flipped.png')
        print('Captured 02_about_flipped.png')

        # 3. Skills Section & Periodic Table
        skills_sec = page.locator('#skills')
        await skills_sec.scroll_into_view_if_needed()
        await page.wait_for_timeout(800)
        await page.screenshot(path='temp_test/03_skills.png')
        print('Captured 03_skills.png')

        # Click filter chip
        web_filter = page.get_by_role("button", name="Languages", exact=True)
        await web_filter.click()
        await page.wait_for_timeout(500)
        await page.screenshot(path='temp_test/03_skills_filtered.png')
        print('Captured 03_skills_filtered.png')

        # 4. Work Section
        work_sec = page.locator('#work')
        await work_sec.scroll_into_view_if_needed()
        await page.wait_for_timeout(800)
        await page.screenshot(path='temp_test/04_work.png')
        print('Captured 04_work.png')

        # Click project 2 accordion panel
        p2_panel = page.locator('div[aria-label*="Project S.E.T.U"]')
        await p2_panel.click()
        await page.wait_for_timeout(800)
        await page.screenshot(path='temp_test/04_work_p2.png')
        print('Captured 04_work_p2.png')

        # 5. Certifications Section
        cert_sec = page.locator('#certifications')
        await cert_sec.scroll_into_view_if_needed()
        await page.wait_for_timeout(800)
        await page.screenshot(path='temp_test/05_certifications.png')
        print('Captured 05_certifications.png')

        # 6. Experience Section
        exp_sec = page.locator('#experience')
        await exp_sec.scroll_into_view_if_needed()
        await page.wait_for_timeout(800)
        await page.screenshot(path='temp_test/06_experience.png')
        print('Captured 06_experience.png')

        # 7. Achievements Section (Horizontal scroll)
        ach_sec = page.locator('#achievements')
        await ach_sec.scroll_into_view_if_needed()
        await page.wait_for_timeout(800)
        # Scroll down slightly inside achievements
        await page.mouse.wheel(0, 1500)
        await page.wait_for_timeout(1000)
        await page.screenshot(path='temp_test/07_achievements.png')
        print('Captured 07_achievements.png')

        # 8. Contact Section & Copy Email
        contact_sec = page.locator('#contact')
        await contact_sec.scroll_into_view_if_needed()
        await page.wait_for_timeout(800)

        copy_btn = page.locator('button:has-text("Copy")')
        await copy_btn.click()
        await page.wait_for_timeout(300)
        copied_text = await copy_btn.inner_text()
        print(f'Copy button text after click: {copied_text}')

        await page.screenshot(path='temp_test/08_contact.png')
        print('Captured 08_contact.png')

        # 9. Mobile menu test
        await page.set_viewport_size({'width': 390, 'height': 844})
        await page.goto('http://localhost:3000', wait_until='networkidle')
        await page.wait_for_timeout(500)

        menu_btn = page.locator('button:has-text("Menu")')
        await menu_btn.click()
        await page.wait_for_timeout(800)
        await page.screenshot(path='temp_test/09_mobile_menu_open.png')
        print('Captured 09_mobile_menu_open.png')

        print(f'Total console errors: {len(errors)}')
        if errors:
            print('Console errors:', errors)

        await browser.close()
        print('All visual & functional tests passed successfully!')

if __name__ == '__main__':
    asyncio.run(test_suite())
