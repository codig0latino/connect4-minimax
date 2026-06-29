# Design System: Cheerful Connection

This document outlines the design system used for the Connect 4 Minimax project. 

## Overview
The "Cheerful Connection" theme is designed to be vibrant, inviting, and highly responsive. It leverages a modern aesthetic with bright primary colors, soft backgrounds, rounded corners, and clear typography.

## Color Palette

Defined in `tailwind.config.cjs`:

- **Primary (`#007bff`)**: Used for the main branding, primary buttons, and the game board container.
- **Secondary (`#ffd700`)**: Used for the machine's pieces and related UI elements (e.g., machine score card).
- **Tertiary (`#ff4d4d`)**: Used for the player's pieces and related UI elements.
- **Surface (`#f5faff`)**: The default light blue background color for the application.
- **Soft Sky (`#e0f2fe`)**: Used for empty board slots and the difficulty modal background.

### Difficulty Colors
- **Fácil (`#4ade80`)**: Green, indicating an easy or beginner-friendly level.
- **Medio (`#fb923c`)**: Orange, indicating a standard challenge.
- **Difícil (`#f87171`)**: Red, indicating a hard, strategic challenge.

## Typography

- **Font Family**: Plus Jakarta Sans
- **Headlines**: Extra bold, tight letter spacing.
- **Labels**: Uppercase, wide tracking for clarity (e.g., "TU TURNO").
- **Numbers**: Large and prominent for score tracking.

## UI Components

### Modals
- Built with a full-screen blurred backdrop (`backdrop-blur-md`).
- Modals have large rounded corners (`rounded-[2rem]` or `rounded-[3rem]`).
- Prominent icons using Material Symbols Outlined.

### Buttons
- Interactive buttons feature hover effects (`hover:opacity-80`, `hover:bg-primary-container`).
- Active states have a slight scale-down effect (`active:scale-95`) for tactile feedback.
- Uses `transition-all` for smooth hover and active state transitions.

### Game Board
- The board has a thick border and a solid shadow (`box-shadow: 0 10px 0 #0056b3`) to give it a 3D physical toy appearance.
- Pieces drop in with a cubic-bezier CSS animation to simulate gravity and bouncing.
