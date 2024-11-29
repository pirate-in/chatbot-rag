# Chatbot application with user interface implemented in React and tailwind css.

Sample application build with python as backend and react as front end and deployed in same container.
    Backend use uvicorn and ui use nginx
## Usage


1. Clone the repository to your local machine.
    ```sh
    git clone git clone https://github.com/pirate-in/chatbot-rag.git
    ```

1. Build docker image
    ```sh
    docker build chatbot-rag .  [OR] docker compose -f "docker-compose.yml" up -d --build 
    ```

1. Start the development server.
    ```sh
    docker compose -f "docker-compose.yml" up -d --build 
    ```
1. Open the project in your browser at [`http://localhost`](http://localhost) to view your project.API is available at http://localhost/api/docs
2. 
1. Create your React components and add your styles using Tailwind classes. You can also create new CSS files and import them into your components.

## Contributing

Contributions are welcome!

## Author
samdani.md@gmail.com