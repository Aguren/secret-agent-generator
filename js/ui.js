/* ==========================================================================
   MISSION CONTROL UI ENGINE // EXPRESS 3-STEP BUILDER
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initClueCountToggles();
    initLivePreview();
    initPresets();
    initRandomizers();
    initHeaderModal();
    initCopyCodesBtn();
    initCertToggle();
    initHideoutChips();
});

/**
 * Toast Notification System
 */
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast-item ${type} animate-in`;
    
    let icon = 'fa-info-circle';
    if (type === 'success') icon = 'fa-check-circle';
    if (type === 'warn') icon = 'fa-triangle-exclamation';

    toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-10px)';
        setTimeout(() => toast.remove(), 300);
    }, 2800);
}

window.showToast = showToast;

/**
 * Toggles visibility of Certificate customization controls inside Advanced Options
 */
function initCertToggle() {
    const certCheckbox = document.getElementById('opt-include-cert');
    const certWrapper = document.getElementById('cert-customizer-wrapper');

    if (!certCheckbox || !certWrapper) return;

    const updateCertVisibility = () => {
        if (certCheckbox.checked) {
            certWrapper.classList.remove('hidden');
        } else {
            certWrapper.classList.add('hidden');
        }
    };

    certCheckbox.addEventListener('change', () => {
        if (window.SoundEngine) window.SoundEngine.playKeyClick();
        updateCertVisibility();
    });

    updateCertVisibility();
}

/**
 * Hideout Helper Location Chips
 */
function initHideoutChips() {
    const chipButtons = document.querySelectorAll('.chip-btn');
    if (!chipButtons.length) return;

    chipButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const locationText = btn.getAttribute('data-location');
            if (!locationText) return;

            const clueInputs = [
                document.getElementById('clue-1'),
                document.getElementById('clue-2'),
                document.getElementById('clue-3'),
                document.getElementById('clue-4'),
                document.getElementById('clue-5')
            ].filter(input => input && input.offsetParent !== null);

            const activeElem = document.activeElement;
            let targetInput = null;

            if (activeElem && activeElem.classList.contains('clue-input')) {
                targetInput = activeElem;
            } else {
                targetInput = clueInputs.find(i => i.value.trim() === '') || clueInputs[0];
            }

            if (targetInput) {
                targetInput.value = locationText;
                if (window.SoundEngine) window.SoundEngine.playKeyClick();
                if (window.refreshLivePreview) window.refreshLivePreview();
                showToast(`Filled: "${locationText}"`, 'info');
            }
        });
    });
}

/**
 * 1-Click Preset Templates, 1-Tap Auto-Randomizer & Clear All Button
 */
function initPresets() {
    const presetButtons = document.querySelectorAll('.btn-preset');
    const btnClear = document.getElementById('btn-clear-clues');
    const btnRandomAll = document.getElementById('btn-random-all-spots');
    
    const presets = {
        indoor: [
            'LOOK IN THE FRIDGE',
            'CHECK UNDER YOUR PILLOW',
            'LOOK BEHIND THE MIRROR',
            'CHECK INSIDE THE COUCH',
            'LOOK INSIDE YOUR SHOE'
        ],
        bedtime: [
            'CHECK INSIDE YOUR PJ DRAWER',
            'LOOK BEHIND YOUR BEDLAMP',
            'CHECK NEAR YOUR TOOTHBRUSH',
            'LOOK UNDER YOUR BLANKET',
            'CHECK YOUR NIGHTSTAND'
        ],
        backyard: [
            'LOOK INSIDE THE MAILBOX',
            'CHECK UNDER THE PATIO CHAIR',
            'LOOK BEHIND THE FLOWER POT',
            'CHECK NEAR THE GARDEN HOSE',
            'LOOK UNDER THE BACK DOOR MAT'
        ]
    };

    const globalRandomSpots = [
        'LOOK IN THE FRIDGE', 'CHECK UNDER YOUR PILLOW', 'LOOK BEHIND THE MIRROR',
        'CHECK INSIDE THE COUCH', 'LOOK INSIDE YOUR SHOE', 'LOOK INSIDE THE MAILBOX',
        'CHECK UNDER THE BATHROOM SINK', 'SEARCH INSIDE THE BOOKSHELF', 'CHECK UNDER THE BACK DOOR MAT',
        'LOOK BEHIND YOUR BEDLAMP', 'CHECK INSIDE YOUR PJ DRAWER', 'SEARCH BEHIND THE TV'
    ];

    presetButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const key = btn.getAttribute('data-preset');
            if (!key) return;

            const list = presets[key];
            if (!list) return;

            if (window.SoundEngine) window.SoundEngine.playKeyClick();

            document.getElementById('clue-1').value = list[0];
            document.getElementById('clue-2').value = list[1];
            document.getElementById('clue-3').value = list[2];
            document.getElementById('clue-4').value = list[3];
            document.getElementById('clue-5').value = list[4];

            if (window.refreshLivePreview) window.refreshLivePreview();
            showToast(`Loaded ${key.toUpperCase()} Preset Clues`, 'success');
        });
    });

    // 1-Tap Auto-Randomizer Handler
    if (btnRandomAll) {
        btnRandomAll.addEventListener('click', () => {
            if (window.SoundEngine) window.SoundEngine.playKeyClick();

            const shuffled = [...globalRandomSpots].sort(() => 0.5 - Math.random());

            document.getElementById('clue-1').value = shuffled[0];
            document.getElementById('clue-2').value = shuffled[1];
            document.getElementById('clue-3').value = shuffled[2];
            document.getElementById('clue-4').value = shuffled[3];
            document.getElementById('clue-5').value = shuffled[4];

            if (window.refreshLivePreview) window.refreshLivePreview();
            showToast("🎲 Auto-Filled Random Household Hunt!", "success");
        });
    }

    // Clear All Clues Handler
    if (btnClear) {
        btnClear.addEventListener('click', () => {
            if (window.SoundEngine) window.SoundEngine.playKeyClick();

            document.getElementById('clue-1').value = '';
            document.getElementById('clue-2').value = '';
            document.getElementById('clue-3').value = '';
            document.getElementById('clue-4').value = '';
            document.getElementById('clue-5').value = '';

            if (window.refreshLivePreview) window.refreshLivePreview();
            showToast("Cleared All Clue Locations", "info");
        });
    }
}

/**
 * Randomize / Shuffle Single Clue Button logic
 */
function initRandomizers() {
    const themeCluePools = {
        'theme-spy': [
            'CHECK UNDER THE SOFA CUSHION', 'LOOK IN THE REFRIGERATOR', 'SEARCH BEHIND THE MIRROR',
            'INSPECT INSIDE YOUR SHOE', 'EXAMINE THE MAILBOX', 'LOOK INSIDE THE TOOTHBRUSH CUP'
        ],
        'theme-magic': [
            'SEEK THE ENCHANTED MIRROR', 'SEARCH THE POTION CABINET', 'LOOK INSIDE YOUR SPELL SATCHEL',
            'CHECK BENEATH THE MAGIC BED', 'EXAMINE THE CRYSTAL SHELF', 'SEARCH THE GARDEN FLOWER POT'
        ],
        'theme-royal': [
            'SEEK THE PALACE THRONE', 'CHECK INSIDE THE JEWELRY BOX', 'SEARCH THE ROYAL GARDEN HOSE',
            'LOOK BEHIND THE VELVET DRESSER', 'CHECK UNDER THE CROWN PILLOW', 'EXAMINE THE KINGDOM MAILBOX'
        ],
        'theme-pirate': [
            'SEEK THE LOOKING GLASS MIRROR', 'CHECK THE GALLEY FRIDGE', 'LOOK INSIDE THE CAPTAIN COUCH',
            'SEARCH THE BUCCANEER SHOE', 'CHECK BENEATH THE DECK MAT', 'LOOK INSIDE THE SEA MAILBOX'
        ],
        'theme-galaxy': [
            'SCAN SECTOR REFRIGERATOR', 'CHECK SUB-SPACE PILLOW', 'LOOK BEHIND OPTICAL MIRROR',
            'INSPECT STARSHIP COUCH', 'SCAN FLEET MAILBOX POD', 'CHECK OXYGEN SHOE CHAMBER'
        ]
    };

    const buttons = document.querySelectorAll('.btn-random-clue');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            const input = document.getElementById(targetId);
            if (!input) return;

            const currentThemeId = window.ThemeManager ? window.ThemeManager.currentThemeId : 'theme-spy';
            const pool = themeCluePools[currentThemeId] || themeCluePools['theme-spy'];

            const randomClue = pool[Math.floor(Math.random() * pool.length)];
            input.value = randomClue;

            if (window.SoundEngine) window.SoundEngine.playKeyClick();
            if (window.refreshLivePreview) window.refreshLivePreview();

            showToast("Shuffled Theme Clue", "info");
        });
    });
}

/**
 * Copy Codes Button
 */
function initCopyCodesBtn() {
    const btn = document.getElementById('btn-copy-code');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const listContainer = document.getElementById('preview-missions-list');
        if (!listContainer) return;

        const boxes = listContainer.querySelectorAll('.preview-mission-box');
        let textOutput = "=== ADVENTURE CODES ===\n";

        boxes.forEach(b => {
            const tag = b.querySelector('.mission-tag')?.textContent || '';
            const enc = b.querySelector('.cipher-text')?.textContent || '';
            textOutput += `${tag}: ${enc}\n`;
        });

        navigator.clipboard.writeText(textOutput).then(() => {
            if (window.SoundEngine) window.SoundEngine.playKeyClick();
            showToast("Copied Encrypted Codes to Clipboard!", "success");
        }).catch(() => {
            showToast("Failed to copy codes", "warn");
        });
    });
}

/**
 * How It Works Briefing Modal
 */
function initHeaderModal() {
    const btnOpen = document.getElementById('btn-open-briefing');
    const modal = document.getElementById('briefing-modal');
    const btnClose = document.getElementById('btn-close-modal');
    const btnDismiss = document.getElementById('btn-dismiss-modal');

    if (!modal) return;

    function openModal(e) {
        if (e) e.preventDefault();
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
        if (window.SoundEngine) window.SoundEngine.playKeyClick();
    }

    function closeModal(e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        modal.classList.add('hidden');
        modal.style.display = 'none';
        if (window.SoundEngine) window.SoundEngine.playKeyClick();
    }

    if (btnOpen) btnOpen.onclick = openModal;
    if (btnClose) btnClose.onclick = closeModal;
    if (btnDismiss) btnDismiss.onclick = closeModal;

    modal.onclick = (e) => {
        if (e.target === modal) closeModal(e);
    };
}

/**
 * Handles 3, 4, or 5 clue toggles
 */
function initClueCountToggles() {
    const clueButtons = document.querySelectorAll('#clue-count-selector .btn-toggle');
    const clue4Wrapper = document.getElementById('clue-4-wrapper');
    const clue5Wrapper = document.getElementById('clue-5-wrapper');
    const clue4Input = document.getElementById('clue-4');
    const clue5Input = document.getElementById('clue-5');

    clueButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (window.SoundEngine) window.SoundEngine.playKeyClick();
            
            clueButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const count = parseInt(btn.getAttribute('data-clues'), 10);

            if (count === 3) {
                clue4Wrapper.classList.add('hidden');
                clue5Wrapper.classList.add('hidden');
                clue4Input.required = false;
                clue5Input.required = false;
            } else if (count === 4) {
                clue4Wrapper.classList.remove('hidden');
                clue5Wrapper.classList.add('hidden');
                clue4Input.required = true;
                clue5Input.required = false;
            } else if (count === 5) {
                clue4Wrapper.classList.remove('hidden');
                clue5Wrapper.classList.remove('hidden');
                clue4Input.required = true;
                clue5Input.required = true;
            }

            if (window.refreshLivePreview) {
                window.refreshLivePreview();
            }
        });
    });
}

/**
 * Updates mission clues live preview
 */
function initLivePreview() {
    const juniorAgentNameInput = document.getElementById('junior-agent-name');
    const juniorAgentCodeInput = document.getElementById('junior-agent-code');
    const cipherTypeSelect = document.getElementById('cipher-type');
    const previewAgentName = document.getElementById('preview-agent-name');
    const previewMissionsContainer = document.getElementById('preview-missions-list');

    function updatePreview() {
        const currentTheme = window.ThemeManager ? window.ThemeManager.getCurrentTheme() : {};
        const prefix = currentTheme.cluePrefix || 'Mission';

        const name = juniorAgentNameInput.value.trim() || 'HERO';
        const code = juniorAgentCodeInput.value.trim() || '007';
        if (previewAgentName) previewAgentName.textContent = `${name.toUpperCase()} (${code})`;

        const activeClues = [];
        const clue1 = document.getElementById('clue-1');
        const clue2 = document.getElementById('clue-2');
        const clue3 = document.getElementById('clue-3');
        const clue4 = document.getElementById('clue-4');
        const clue5 = document.getElementById('clue-5');
        const clueFinal = document.getElementById('clue-final');

        if (clue1) activeClues.push({ title: `${prefix.toUpperCase()} 1`, element: clue1, defaultText: 'LOOK IN THE FRIDGE' });
        if (clue2) activeClues.push({ title: `${prefix.toUpperCase()} 2`, element: clue2, defaultText: 'CHECK UNDER YOUR PILLOW' });
        if (clue3) activeClues.push({ title: `${prefix.toUpperCase()} 3`, element: clue3, defaultText: 'LOOK BEHIND THE MIRROR' });

        const clue4Wrapper = document.getElementById('clue-4-wrapper');
        if (clue4Wrapper && !clue4Wrapper.classList.contains('hidden') && clue4) {
            activeClues.push({ title: `${prefix.toUpperCase()} 4`, element: clue4, defaultText: 'CHECK INSIDE THE COUCH' });
        }

        const clue5Wrapper = document.getElementById('clue-5-wrapper');
        if (clue5Wrapper && !clue5Wrapper.classList.contains('hidden') && clue5) {
            activeClues.push({ title: `${prefix.toUpperCase()} 5`, element: clue5, defaultText: 'LOOK INSIDE YOUR SHOE' });
        }

        if (clueFinal) activeClues.push({ title: 'FINAL REWARD', element: clueFinal, defaultText: 'MISSION COMPLETE GREAT JOB' });

        if (!previewMissionsContainer) return;
        previewMissionsContainer.innerHTML = '';
        const selectedCipher = cipherTypeSelect ? cipherTypeSelect.value : 'number';

        activeClues.forEach(item => {
            const rawMessage = item.element.value.trim() || item.element.placeholder || item.defaultText;
            const encrypted = window.CipherEngine ? window.CipherEngine.encode(rawMessage, selectedCipher) : rawMessage;

            const box = document.createElement('div');
            box.className = 'preview-mission-box';
            
            box.innerHTML = `
                <span class="mission-tag">${item.title}</span>
                <div class="raw-text">${rawMessage}</div>
                <div class="cipher-text">${encrypted || '---'}</div>
            `;
            previewMissionsContainer.appendChild(box);
        });
    }

    window.refreshLivePreview = updatePreview;

    const allInputs = document.querySelectorAll('.config-panel input');
    allInputs.forEach(input => {
        input.addEventListener('input', () => {
            updatePreview();
        });
    });

    if (cipherTypeSelect) {
        cipherTypeSelect.addEventListener('change', () => {
            updatePreview();
        });
    }

    updatePreview();
}