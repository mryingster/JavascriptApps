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

function renderLevelPreview(canvas, level) {
    const ctx = canvas.getContext("2d");

    const w = canvas.width / 13;
    const h = w / 2;

    // Draw bricks
    for (let y=0; y<level.bricks.length; y++) {
        for (let x=0; x<level.bricks[y].length; x++) {
            const brick = level.bricks[y][x];
            if (brick != null) {
                const style = brick_types[level.bricks[y][x]];
                const color = `hsl(${style.h}, ${style.s}%, ${style.l}%)`;
                ctx.fillStyle = color;
                ctx.fillRect(x * w, y * h, w, h);
            }
        }
    }

    return;
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
        // Create preview image
        let preview = document.createElement('canvas');
        preview.classList.add("preview");
        preview.width = 130;
        preview.height = 90;
        renderLevelPreview(preview, levels[index]);
        buttons.append(preview);

        let text = `${levels[index].source}`;
        if (levels[index].note != "")
            text += ` (${levels[index].note})`;
        const btn = document.createElement('button');
        btn.className = 'game-modal-button';
        btn.textContent = text;
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
