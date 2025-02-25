# Agentic Platform

A powerful platform for building and deploying AI agents with a focus on email communication capabilities. This project leverages the Mastra framework to create intelligent agents that can compose, manage, and send emails with natural language processing capabilities.

## 🚀 Features

- **Email Communication Agents**: Specialized agents for composing and sending professional emails
- **Message Composition**: AI-powered message composition with tone consistency evaluation
- **Email Templates**: Generate and manage email templates for various use cases
- **Supervision**: Supervisor agents to ensure quality and appropriateness of communications
- **Evaluation Metrics**: Built-in evaluation metrics for assessing agent performance

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

## 🛠️ Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/agentic-platform.git
   cd agentic-platform
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   RESEND_API_KEY=your_resend_api_key
   RESEND_DEFAULT_SENDER=your_default_sender_email
   OPENAI_API_KEY=your_openai_api_key
   ANTHROPIC_API_KEY=your_anthropic_api_key
   ```

## 🚀 Usage

### Development

Start the development server:

```bash
npm run dev
```

### Testing

Run tests:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Run tests with UI:

```bash
npm run test:ui
```

Generate test coverage:

```bash
npm run test:coverage
```

### Code Quality

Format code:

```bash
npm run format
```

Lint code:

```bash
npm run lint
```

Fix linting issues:

```bash
npm run lint:fix
```

## 🏗️ Project Structure

```
agentic-platform/
├── .github/            # GitHub configuration
├── .husky/             # Git hooks
├── .mastra/            # Mastra configuration
├── src/                # Source code
│   ├── examples/       # Example implementations
│   ├── mastra/         # Mastra framework integration
│   │   ├── agents/     # Agent definitions
│   │   ├── tools/      # Tool implementations
│   │   ├── utils/      # Utility functions
│   │   └── workflows/  # Workflow definitions
│   └── test-config/    # Test configuration
├── .env                # Environment variables
├── .env.development    # Development environment variables
├── .env.test           # Test environment variables
├── package.json        # Project dependencies and scripts
└── tsconfig.json       # TypeScript configuration
```

## 🧩 Core Components

### Agents

- **Email Agent**: Composes and sends professional emails
- **Message Composer Agent**: Specializes in crafting message content
- **Email Template Agent**: Generates and manages email templates
- **Supervisor Email Agent**: Oversees email communications for quality and appropriateness

### Tools

- **Email Tool**: Provides functionality for sending emails via the Resend API

## 📝 Code Style Guidelines

- **TypeScript**: Strong typing with `strict: true`
- **Module System**: ES Modules (import/export)
- **Error Handling**: Use try/catch with specific error types
- **Documentation**: JSDoc comments for functions and interfaces
- **Naming**: camelCase for variables/functions, PascalCase for types/interfaces
- **Structure**: Group related functionality in directories
- **Environment**: Use dotenv for configuration
- **Tools**: Create tools with `createTool()` from @mastra/core
- **Agents**: Define agent behaviors with clean, composable patterns

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [Mastra Framework](https://github.com/mastrajs/mastra)
- [OpenAI](https://openai.com/)
- [Anthropic](https://www.anthropic.com/)
- [Resend](https://resend.com/)
