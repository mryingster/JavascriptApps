function showModal(message) {
    // Remove any existing modal
    const oldModal = document.getElementById('game-modal');
    if (oldModal) oldModal.remove();

    // Create overlay
    const overlay = document.createElement('div');
    overlay.id = 'game-modal';

    // Modal box
    const box = document.createElement('div');
    box.className = 'game-modal-box';

    // Message
    const msg = document.createElement('div');
    msg.className = 'game-modal-message';
    msg.textContent = message;

    // Buttons
    const buttons = document.createElement('div');
    buttons.className = 'game-modal-buttons';

    const okBtn = document.createElement('button');
    okBtn.className = 'game-modal-button';
    okBtn.textContent = 'End Game';
    okBtn.onclick = () => closeModal(overlay);

    const newGameBtn = document.createElement('button');
    newGameBtn.className = 'game-modal-button';
    newGameBtn.textContent = 'Continue';
    newGameBtn.onclick = () => {
        closeModal(overlay);
        new_game(true);
    };

    buttons.append(okBtn, newGameBtn);
    box.append(msg, buttons);
    overlay.append(box);
    document.body.append(overlay);

    // Key Listeners
    function handleKey(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            newGameBtn.click();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            okBtn.click();
        }
    }

    document.addEventListener('keydown', handleKey);

    // Clean up key listener when modal closes
    overlay.addEventListener('remove', () => {
        document.removeEventListener('keydown', handleKey);
    });
}

// Fade-out and remove modal
function closeModal(overlay) {
    overlay.style.animation = 'fadeOut 0.3s ease forwards';
    setTimeout(() => overlay.remove(), 300);
}

function showLevelSelection(stage, levelIndicies) {
    // Remove any existing modal
    const oldModal = document.getElementById('game-modal');
    if (oldModal) oldModal.remove();

    // Create overlay
    const overlay = document.createElement('div');
    overlay.id = 'game-modal';

    // Modal box
    const box = document.createElement('div');
    box.className = 'game-modal-box';

    // Message
    const msg = document.createElement('div');
    msg.className = 'game-modal-message';
    msg.textContent = `Stage ${stage}: Select Level`;

    // Buttons
    const buttons = document.createElement('div');
    buttons.className = 'game-modal-buttons';

    for (let index of levelIndicies) {
        const btn = document.createElement('button');
        btn.className = 'game-modal-button';
        btn.textContent = `${levels[index].source}`;
        btn.onclick = () => {
            closeModal(overlay);
            populate_level(levels[index]);
        };
        buttons.append(btn);
    }

    box.append(msg, buttons);
    overlay.append(box);
    document.body.append(overlay);
}
