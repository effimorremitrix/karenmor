# Design Guidelines: Karen Mor Psychology Practice

## Design Approach
**Reference-Based Approach** drawing from healthcare/wellness platforms (Headspace, Calm) and professional service sites. Emphasize warmth, trust, and accessibility to connect with parents seeking help for their children.

## Core Design Principles
1. **Warm Professionalism**: Balance clinical expertise with approachable, empathetic design
2. **Parent-Centric Navigation**: Clear, stress-free pathways to information and contact
3. **Trust Through Clarity**: Straightforward layouts that reduce anxiety
4. **Cultural Sensitivity**: RTL-optimized Hebrew interface with appropriate cultural context

## Typography
- **Primary Font**: Heebo or Assistant (Hebrew-optimized, warm sans-serif) via Google Fonts
- **Hierarchy**: 
  - Hero Headlines: text-5xl md:text-6xl font-bold
  - Section Titles: text-3xl md:text-4xl font-semibold
  - Service Titles: text-xl font-medium
  - Body Text: text-base md:text-lg leading-relaxed
  - Captions: text-sm

## Layout System
**Spacing Units**: Use Tailwind units of 4, 6, 8, 12, 16 for consistency (p-4, mt-8, gap-6, etc.)
- Section Padding: py-16 md:py-24
- Component Spacing: gap-8 md:gap-12
- Container: max-w-7xl mx-auto px-6

## Page Structure & Sections

**1. Hero Section** (80vh with large hero image)
- Warm, professional photo: Karen working with a child/family (authentic, candid moment)
- Overlay with semi-transparent backdrop
- Headline in first person: Large, centered text introducing Karen's approach
- Subheadline highlighting experience/specialization
- Primary CTA button with blurred background (no hover states on image buttons)
- Trust indicator: "15+ years experience" or similar credential

**2. About Section** (2-column: photo + text)
- Professional headshot of Karen (warm, approachable)
- Personal narrative in first person, conversational tone
- Credentials and approach overview
- Secondary image: workspace/therapy environment

**3. Services Grid** (3-column on desktop, stack on mobile)
- Icon + Title + Description cards
- Icons from Heroicons (outline style)
- Each card includes: service name, brief description, key benefits
- Hover elevation effect for depth
- "Learn More" link in each card

**4. Specializations Section** (Badge-style horizontal layout)
- Clean list of expertise areas
- Pill-shaped badges with icons
- Arranged in flowing rows, responsive wrapping

**5. Why Work With Me** (Alternating 2-column sections)
- 3-4 key differentiators
- Each with supporting image (therapy room, materials, parent meeting)
- Text-image alternation (image left, then right)
- Emphasize collaborative approach and personalized care

**6. Testimonials** (Single column, centered)
- 2-3 parent testimonials
- Quote-style design with attribution
- Simple, elegant presentation
- Authentic parent perspectives

**7. Workshop/Programs Highlight** (Card grid)
- 2-3 featured programs/workshops
- Date/time if applicable
- Registration or inquiry CTA

**8. Contact Section** (2-column split)
- Left: Contact form (name, email, phone, message, preferred contact method)
- Right: Direct contact info, office hours, location with map embed placeholder
- Prominent phone number and WhatsApp option for Israel market
- Address with directions link

**9. Footer** (Comprehensive)
- Quick links to main sections
- Contact information
- Professional affiliations/credentials
- Privacy policy link
- Social media (if applicable)
- Copyright notice

## Component Library

**Navigation**: 
- Sticky header with logo, main menu, contact CTA button
- Mobile: Hamburger menu
- RTL-optimized for Hebrew

**Buttons**: 
- Primary: Solid with rounded corners (rounded-lg), medium weight
- Secondary: Outline style
- Size: px-6 py-3 for standard, px-8 py-4 for hero CTAs

**Cards**: 
- Subtle shadow, rounded corners (rounded-xl)
- Padding: p-6 md:p-8
- Hover: slight elevation increase

**Forms**: 
- Generous input sizing (h-12)
- Clear labels above inputs
- Placeholder text for guidance
- Focus states with subtle border enhancement

**Icons**: 
- Heroicons (outline style)
- Size: w-8 h-8 for feature icons, w-12 h-12 for section icons

## Images

**Required Images**:
1. **Hero**: Large, warm photo of Karen in professional setting with child/family - authentic moment showing connection and care
2. **About**: Professional headshot - approachable, smiling
3. **About Secondary**: Therapy room/workspace environment
4. **Service Support**: 3-4 images showing different therapy settings, materials, or age groups
5. **Trust Building**: Parent consultation image, group therapy setting

**Image Treatment**: Soft edges (rounded-lg), never harsh borders, professional photography style

## Accessibility
- High contrast text ratios
- Form labels always visible
- Keyboard navigation support
- RTL-optimized layouts for Hebrew
- Touch-friendly targets (min 44px)

## Mobile Responsiveness
- Stack all multi-column layouts on mobile
- Generous touch targets
- Simplified navigation
- Hero adjusts to 60vh on mobile
- Text sizes scale appropriately

This comprehensive design creates a warm, trustworthy, professional presence that resonates with parents seeking support for their children.