# Planning Guide

A modern QR Code generator that creates scannable codes for various data types with customization options for different use cases, from simple links to WiFi credentials.

**Experience Qualities**: 
1. **Efficient** - Users should be able to generate a QR code in under 30 seconds with minimal friction
2. **Professional** - The interface should feel polished and trustworthy for both personal and business use
3. **Intuitive** - First-time users should immediately understand how to create their desired QR code type

**Complexity Level**: Light Application (multiple features with basic state)
This is a focused tool with distinct feature sets (different QR types) and some customization state, but without complex workflows or multiple views. Users complete a single primary task: configure and generate a QR code.

## Essential Features

### Multi-Type QR Generation
- **Functionality**: Support for URL/Link, Plain Text, WiFi credentials, Email, Phone, and SMS QR codes
- **Purpose**: Cover the most common QR code use cases in a single application
- **Trigger**: User selects QR type from tab or dropdown selector
- **Progression**: Select type → Input data (form fields adapt to type) → Preview updates live → Download/copy
- **Success criteria**: Generated QR codes scan correctly on iOS and Android devices for all supported types

### Visual Customization
- **Functionality**: Adjust foreground/background colors, add margins/quiet zone, embed center logo/image, adjust size
- **Purpose**: Enable branded and personalized QR codes while maintaining scannability
- **Trigger**: User interacts with customization panel controls
- **Progression**: Adjust color picker → Preview updates instantly → Toggle logo upload → Adjust size slider → Verify preview → Download
- **Success criteria**: Customized codes maintain >95% scan success rate, preview matches downloaded output exactly

### Live Preview & Download
- **Functionality**: Real-time QR code preview that updates as user types/adjusts, with download as PNG/SVG
- **Purpose**: Immediate visual feedback ensures users get exactly what they expect
- **Trigger**: Any change to data or customization options
- **Progression**: User types/changes options → Preview renders within 100ms → User clicks download → File saves locally
- **Success criteria**: Preview renders without lag, downloaded files are high-quality and scan reliably

### Data Persistence
- **Functionality**: Save recent QR configurations for quick regeneration
- **Purpose**: Users often need to regenerate similar codes or iterate on designs
- **Trigger**: Auto-save on generation, accessible via history panel
- **Progression**: User generates QR → Config auto-saves → User opens history → Selects previous config → Form repopulates
- **Success criteria**: Last 10 configurations persist across sessions, reload correctly

## Edge Case Handling
- **Empty Input**: Show helpful placeholder text and disable download until valid data entered
- **Invalid URLs**: Detect and warn about malformed URLs, offer to auto-correct common mistakes (missing https://)
- **WiFi Special Characters**: Escape special characters in WiFi passwords that could break QR encoding
- **Logo Too Large**: Warn when center logo exceeds 30% of QR area (reduces scannability), auto-resize if needed
- **Color Contrast**: Warn when foreground/background colors have insufficient contrast for reliable scanning
- **Long Text**: Show character count and warn when text length may create overly dense QR codes

## Design Direction
The design should feel modern, technical, and precise - like a professional tool that balances power with simplicity. It should evoke confidence through clean layouts, purposeful animations, and a sophisticated color palette that feels contemporary without being flashy.

## Color Selection

- **Primary Color**: `oklch(0.45 0.15 270)` - Deep purple-blue that communicates technology, precision, and trustworthiness
- **Secondary Colors**: 
  - Background: `oklch(0.98 0.005 270)` - Barely-tinted lavender white for subtle tech feel
  - Surface: `oklch(1 0 0)` - Pure white for cards and controls
- **Accent Color**: `oklch(0.65 0.25 155)` - Vibrant cyan-green for CTAs, success states, and the generated QR preview highlight
- **Foreground/Background Pairings**:
  - Primary (`oklch(0.45 0.15 270)`): White text (`oklch(1 0 0)`) - Ratio 8.5:1 ✓
  - Accent (`oklch(0.65 0.25 155)`): White text (`oklch(1 0 0)`) - Ratio 4.6:1 ✓
  - Background (`oklch(0.98 0.005 270)`): Dark text (`oklch(0.2 0.02 270)`) - Ratio 14.2:1 ✓
  - Surface (`oklch(1 0 0)`): Foreground text (`oklch(0.2 0.02 270)`) - Ratio 15.8:1 ✓

## Font Selection
Use typefaces that feel technical and precise while remaining highly readable - **JetBrains Mono** for data inputs and code-like elements, **Space Grotesk** for headings and UI labels.

- **Typographic Hierarchy**:
  - H1 (App Title): Space Grotesk Bold/32px/tight letter-spacing/-0.02em
  - H2 (Section Headers): Space Grotesk SemiBold/20px/normal letter-spacing
  - H3 (Input Labels): Space Grotesk Medium/14px/wide letter-spacing/0.01em/uppercase
  - Body (Help Text): Space Grotesk Regular/15px/relaxed line-height/1.6
  - Input Text: JetBrains Mono Regular/14px/monospace for URLs and technical data
  - Button Labels: Space Grotesk SemiBold/14px/letter-spacing/0.02em

## Animations
Animations should feel snappy and functional, reinforcing the technical precision of the tool. Use subtle micro-interactions on controls (button presses with slight scale, color picker preview bubbles) and smooth transitions when switching QR types. The QR code preview should have a gentle fade-in when regenerating to indicate the update. Download button gets a satisfying click animation with slight bounce.

## Component Selection

- **Components**:
  - Tabs: For switching between QR code types (URL, Text, WiFi, Email, etc.)
  - Card: Container for the QR preview and customization panels
  - Input: Text fields for URL, text content, WiFi SSID, passwords, etc.
  - Label: For all form field labels
  - Select: Dropdown for WiFi encryption type
  - Button: Primary for download, secondary for copy/share actions
  - Slider: For adjusting QR code size and logo scale
  - Popover + color picker: For foreground/background color selection
  - Switch: Toggle options like "Add logo" and "Show border"
  - Separator: Dividing sections in the customization panel
  - Dialog: For showing recent history of generated QR codes
  - Tooltip: Explaining technical options like "Quiet Zone" and "Error Correction"

- **Customizations**:
  - Custom QR code renderer component using a QR library (qrcode library via npm)
  - Custom color picker input combining Popover with native color input
  - Custom file upload component for center logo with preview thumbnail
  - Custom recent history list showing mini QR previews with truncated data

- **States**:
  - Buttons: Primary download button uses accent color, hover brightens by 5%, active state scales to 0.98, disabled state at 50% opacity
  - Inputs: Focus state shows accent-color ring with 2px width, invalid inputs show subtle red tint
  - Sliders: Thumb uses accent color, track is muted gray, active state increases thumb size by 10%
  - Tabs: Active tab has accent-color underline with 3px thickness, inactive tabs are muted

- **Icon Selection**:
  - Download: ArrowDown or DownloadSimple
  - Link/URL: Link or LinkSimple  
  - Text: TextAa or Article
  - WiFi: WifiHigh
  - Email: Envelope or EnvelopeSimple
  - Phone: Phone
  - Settings/Customize: Gear or Sliders
  - Image upload: Image or Upload
  - History: ClockCounterClockwise
  - Color picker: Palette

- **Spacing**:
  - Container padding: p-6 (24px) on desktop, p-4 (16px) on mobile
  - Card internal spacing: p-6
  - Form field vertical spacing: gap-4 (16px)
  - Section spacing: gap-8 (32px)
  - Button padding: px-6 py-3
  - Consistent 4px base spacing scale throughout

- **Mobile**: 
  - Stack QR preview above customization panel on mobile (<768px)
  - Tabs switch to scrollable horizontal layout on mobile
  - Reduce QR preview size to fit mobile viewport (max 280px)
  - Full-width buttons on mobile for easier tapping
  - Collapse advanced options into accordion on mobile
  - Color pickers use native mobile color input for better UX
