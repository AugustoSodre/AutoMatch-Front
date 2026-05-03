# AutoMatch Frontend

This is an Angular 14 frontend application for the AutoMatch project.

## Project Structure

```
src/
├── app/                           # Application root module
│   ├── app.component.ts          # Root component
│   ├── app.component.html        # Root component template
│   ├── app.component.scss        # Root component styles
│   ├── app.module.ts             # Root module
│   ├── matches/                  # Matches feature module (lazy-loaded)
│   │   ├── matches.component.ts
│   │   ├── matches.component.html
│   │   ├── matches.component.scss
│   │   └── matches.module.ts
│   └── common-components/        # Shared components module (lazy-loaded)
│       ├── common-components.component.ts
│       ├── common-components.component.html
│       ├── common-components.component.scss
│       └── common-components.module.ts
├── environments/                  # Environment configurations
│   ├── environment.ts            # Development environment
│   └── environment.prod.ts       # Production environment
├── index.html                     # Main HTML file
├── main.ts                        # Application entry point
├── styles.scss                    # Global styles
├── test.ts                        # Test configuration
└── favicon.ico                    # Browser favicon
```

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

Install project dependencies:

```bash
npm install
```

## Development

Start the development server:

```bash
npm start
```

The application will automatically open in your default browser at `http://localhost:4200/`.

## Build

Build the project for production:

```bash
npm run build
```

Or with optimizations:

```bash
npm run build:prod
```

Build artifacts will be stored in the `dist/automatch/` directory.

## Testing

Run unit tests:

```bash
npm test
```

## Code Quality

Run linting:

```bash
npm run lint
```

## Features

- **Modular Architecture**: Feature modules with lazy loading for better performance
- **Responsive UI**: Bootstrap 5 integration for responsive design
- **Routing**: Configured with Angular Router with lazy-loaded feature modules
- **SCSS Support**: SCSS preprocessor for advanced styling
- **TypeScript**: Strict mode enabled for type safety
- **Testing Ready**: Karma and Jasmine configured for unit testing

## Angular CLI Commands

Generate new components:

```bash
ng generate component component-name
ng g c component-name  # shorthand
```

Generate new modules:

```bash
ng generate module module-name
ng g m module-name  # shorthand
```

Generate new services:

```bash
ng generate service service-name
ng g s service-name  # shorthand
```

## Configuration Files

- `angular.json` - Angular CLI configuration
- `tsconfig.json` - TypeScript compiler options
- `tsconfig.app.json` - TypeScript configuration for app build
- `tsconfig.spec.json` - TypeScript configuration for tests
- `karma.conf.js` - Karma test runner configuration
- `.editorconfig` - Editor configuration for consistency
- `.gitignore` - Git ignore patterns

## Environment Variables

Configure environment-specific variables in:
- `src/environments/environment.ts` - Development
- `src/environments/environment.prod.ts` - Production

## Further Help

For more information about Angular CLI, visit the [Angular CLI Documentation](https://angular.io/cli).

For more information about Angular, visit [Angular Documentation](https://angular.io).
 (Angular 14 base)

This is a minimal Angular 14 scaffold with routing and a lazy-loaded `matches` module. A placeholder library at `projects/common-components` is included for future shared components.

Quick start:

1. Install dependencies:

```bash
cd AutoMatch
npm install
```

2. Run the dev server:

```bash
npm start
```

Notes:
- Angular CLI is required to run build and serve commands. Install globally with `npm install -g @angular/cli@14` if needed.
- The `common-components` library is a placeholder at `projects/common-components`.
