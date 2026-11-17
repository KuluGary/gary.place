---
title: >
  [Devlog] - The 20 Games Challenge: Pong
date: 2023-12-22
lang: en
codify: true
tags: ["game-dev"]
description: I wanted to take on 'The 20 Games Challenge' and I started off recreating the game Pong.
---

Some time ago I discovered [The 20 Game Challenge](https://20_games_challenge.gitlab.io/how/), and since I wanted to learn to use Godot as my game dev engine of choice, I decided it good be a good idea to get familiar with it.

Checking out the site, for the first [first challenge](https://20_games_challenge.gitlab.io/challenge/) I decided to choose Pong. I also decided to not give it more than a few hours, since the point wasn't to make a polished end-product instead of a working prototype made for learning.

In this article I want to go into some of the more interesting parts I found while coding. As always, the full code can be found on [my Github](https://github.com/KuluGary/The-20-Games-Challenge---01-Pong).

## The ball

The ball is the most important part of the fame, and it has a few interesting this. In particular, the colliding and bouncing logic.

```gdscript
func _change_direction(body):
	if not body is Ball:
		collision_sound.play()
		if body is Paddle:
			var new_dir = global_position.direction_to(body.global_position)
			dir = -new_dir
		else:
			dir = Vector2(dir.x, -dir.y)
```

We make a few checks in this small function. If the collision is not with itself, which it means colliding with anything other than a Ball node (like the paddles or walls), it must execute a sound we established previously on a `AudioStreamPlayer2D` node.

What I found most interesting here is that depending on what it collides with -a wall or a paddle -, the "bounce" must be slightly different. In the case of the paddle, you must invert the direction based on the position of the ball itself versus the paddle.

Otherwise, if we did something like:

```
dir = -dir
```

What would happen is that the ball would move back and forth, in a straight line and it would never bounce off the walls.

## The player paddle

In the pong game there's two kinds of paddles, the player's and the opponent's. The player's is simpler, since what I did was follow the mouse's position in the y-axis as long as there's a minimum distance (to avoid _jittering_).

```gdscript
func _physics_process(delta):
	velocity = Vector2(velocity.x, global_position.direction_to(get_global_mouse_position()).y) * speed

	if global_position.distance_to(target) > 5:
		move_and_slide()
```

## The opponent paddle

The opponent's paddle has to have a rudimentary AI. It's very easy to make it follow the ball perfectly, but then it would be impossible to defeat it.

The point is that it does follow the ball, but it does so based on a `Timer` node whose wait time is random.

```gdscript
func _physics_process(delta):
	velocity = Vector2(velocity.x, global_position.direction_to(target).y) * speed

	if global_position.distance_to(target) > 5:
		move_and_slide()

func _on_timer_timeout():
	var new_time = randf_range(wait_time.min, wait_time.max)
	timer.set_wait_time(new_time)

	if ball:
		target = ball.global_position
```

## Conclussion

With this three elemens, you have the basics of the game made. The only things left is to simply make the walls, which are `StaticBody2D` nodes and the `Area2D` nodes that are the area the ball has to enter to assign a pointer to the corresponding score.

Again, for more details you can check out [my Github](https://github.com/KuluGary/The-20-Games-Challenge---01-Pong) where you have the full source-code.

In the next few days I'll make an article about the second game challenge, [Breakout](https://github.com/KuluGary/The-20-Games-Challenge---02-Breakout).
