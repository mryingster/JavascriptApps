function sweptCircleVsRect(ball, brick) {
    const r = ball.radius;

    const prevX = ball.prev.x;
    const prevY = ball.prev.y;
    const velX = ball.pos.x - ball.prev.x;
    const velY = ball.pos.y - ball.prev.y;

    // Expanded rectangle
    const minX = brick.pos.x - r;
    const minY = brick.pos.y - r;
    const maxX = brick.pos.x + brick.width + r;
    const maxY = brick.pos.y + brick.height + r;

    let tMin = 0;
    let tMax = 1;

    let normalX = 0;
    let normalY = 0;

    // Check if the ball is already inside the brick (from the previous frame)
    const isInside = (prevX >= minX && prevX <= maxX && prevY >= minY && prevY <= maxY);

    if (isInside) {
        return { hit: false };  // The ball is inside the brick, no collision needed
    }

    // X axis
    if (velX === 0) {
        if (prevX < minX || prevX > maxX) return { hit: false };
    } else {
        const tx1 = (minX - prevX) / velX;
        const tx2 = (maxX - prevX) / velX;

        const t1 = Math.min(tx1, tx2);
        const t2 = Math.max(tx1, tx2);

        if (t1 > tMin) {
            tMin = t1;
            normalX = (tx1 > tx2) ? 1 : -1;
            normalY = 0;
        }

        tMax = Math.min(tMax, t2);
        if (tMin > tMax) return { hit: false };
    }

    // Y axis
    if (velY === 0) {
        if (prevY < minY || prevY > maxY) return { hit: false };
    } else {
        const ty1 = (minY - prevY) / velY;
        const ty2 = (maxY - prevY) / velY;

        const t1 = Math.min(ty1, ty2);
        const t2 = Math.max(ty1, ty2);

        if (t1 > tMin) {
            tMin = t1;
            normalX = 0;
            normalY = (ty1 > ty2) ? 1 : -1;
        }

        tMax = Math.min(tMax, t2);
        if (tMin > tMax) return { hit: false };
    }

    if (tMin < 0 || tMin > 1) return { hit: false };

    // Calculate distance of center of brick from ball start position
    distance = Math.hypot((brick.pos.x + brick.width / 2) - ball.pos.x, (brick.pos.y + brick.height / 2) - ball.pos.y);

    // Reject exit/double hits
    // const dot = velX * normalX + velY * normalY;
    // if (dot >= 0) return { hit: false };

    return {
        hit: true,
        time: tMin,
        normal: { x: normalX, y: normalY },
        distance: distance,
    };
}

function determineEarliestContacts(candidates, eps = 1e-4) {
    let minTime = Infinity;

    for (const c of candidates) {
        const t = c.result.time;

        if (t < minTime) {
            minTime = t;
        }
    }

    const allContacts = [];

    for (const c of candidates) {
        const t = c.result.time;

        if (Math.abs(t - minTime) <= eps) {
            allContacts.push(c);
        }
    }

    return allContacts;
}

function determineClosestContact(candidates) {
    let closest = null;

    for (const c of candidates) {
        if (!closest || c.result.distance < closest.result.distance) {
            closest = c;
        }
    }

    return closest;
}

function applyCollision(ball, collisionResult, epsilon = 1e-4) {
    const P0x = ball.prev.x;
    const P0y = ball.prev.y;

    const Vx = ball.pos.x - ball.prev.x;
    const Vy = ball.pos.y - ball.prev.y;

    const t = collisionResult.time;
    const Nx = collisionResult.normal.x;
    const Ny = collisionResult.normal.y;

    // Move to collision point
    let Cx = P0x + Vx * t;
    let Cy = P0y + Vy * t;

    // Reflect velocity
    let RVx = Vx;
    let RVy = Vy;

    if (Nx !== 0) RVx = -RVx;
    if (Ny !== 0) RVy = -RVy;

    // Push slightly out along normal (prevents re-collision)
    Cx += Nx * epsilon;
    Cy += Ny * epsilon;

    // Move through remaining time
    const remaining = 1 - t;

    const newPosX = Cx + RVx * remaining;
    const newPosY = Cy + RVy * remaining;

    return {
        prev: { x: Cx, y: Cy },
        pos:  { x: newPosX, y: newPosY }
    };
}

function circle_intersect_with_rectangle(cx, cy, cr, rx, ry, rw, rh) {
    let rect_left = rx - cr;
    let rect_right = rx + rw + cr;
    let rect_top = ry - cr;
    let rect_bottom = ry + rh + cr;

    if (cx >= rect_left && cx <= rect_right &&
	cy >= rect_top && cy <= rect_bottom)
	return true;
    return false;
}

// 26.5, 30, 37, 68 <-- default?
function bounceArkanoidStyle(ball, paddle, offset=0) {
    // 1. Normalize hit position -1..1
    const paddleCenter = paddle.pos.x + offset + paddle.width / 2;
    let t = (ball.pos.x - paddleCenter) / (paddle.width / 2);

    // Clamp
    t = Math.max(-1, Math.min(1, t));

    // 2. Define Arkanoid angle zones (in radians)
    // degrees relative to vertical
    const angles = [-68, -37, -30, -26.5, 26.5, 30, 37, 68].map(a => (-90 + a) * Math.PI/180); 
    // This maps to "mostly upward" directions.

    // 3. Map t (-1..1) to zone index
    const idx = Math.round((t + 1) * 0.5 * (angles.length - 1));

    const chosenAngle = angles[idx];

    // 4. Keep the original speed
    const speed = ball.v.s; //Math.hypot(ball.v.x, ball.v.y);

    // 5. Convert angle to velocity
    return {
	x : speed * Math.cos(chosenAngle),
	y : speed * Math.sin(chosenAngle),
	s : speed,
    };
}

