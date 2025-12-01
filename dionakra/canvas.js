function clear_context(ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function canvas_draw_rounded_rectangle(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x, y + radius);
    ctx.arc(x + radius, y + radius, radius, Math.PI, -1/2 * Math.PI); // Top left

    ctx.lineTo(x + width - radius, y);
    ctx.arc(x + width - radius, y + radius, radius, -1/2 * Math.PI, 0); // Top Right

    ctx.lineTo(x + width, y + height - radius);
    ctx.arc(x + width - radius, y + height - radius, radius, 0, 1/2 * Math.PI); // Bottom Right

    ctx.lineTo(x + radius, y + height);
    ctx.arc(x + radius, y + height - radius, radius, 1/2 * Math.PI, Math.PI); // Bottom Left
    ctx.lineTo(x, y + radius);
}

function draw_frame_shadow(ctx) {
    ctx.fillStyle = "#000";

    ctx.fillRect(
	0 + sizes.shadow_offset.horizontal,
	0 + sizes.shadow_offset.vertical,
	sizes.frame.left,
	sizes.canvas.height
    );

    ctx.fillRect(
	0 + sizes.shadow_offset.horizontal,
	0 + sizes.shadow_offset.vertical,
	sizes.canvas.width,
	sizes.frame.top,
    );
}
