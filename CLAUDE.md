# Agent Platform Development Guide

## Commands
- `npm run dev` - Start development server
- `npm run format` - Format code with Prettier
- `npm test` - Run tests (currently unimplemented)
- `tsx src/examples/testEnv.ts` - Test environment variables

## Code Style Guidelines
- **TypeScript**: Strong typing with `strict: true`
- **Module System**: ES Modules (import/export)
- **Error Handling**: Use try/catch with specific error types
- **Documentation**: JSDoc comments for functions and interfaces
- **Naming**: camelCase for variables/functions, PascalCase for types/interfaces
- **Structure**: Group related functionality in directories
- **Environment**: Use dotenv for configuration
- **Tools**: Create tools with `createTool()` from @mastra/core
- **Agents**: Define agent behaviors with clean, composable patterns

## Best Practices
- Keep functions small and focused
- Document exported functions with JSDoc
- Handle errors gracefully with informative messages
- Use Zod for runtime validation