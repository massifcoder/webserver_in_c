# Web Server in C

## What is Web Server?
A server is a computer program or a device that serves content, such as web pages, to clients over the internet or a local network.

![server](https://github.com/massifcoder/webserver_in_c/assets/81623465/55e0780a-e455-4858-8697-b306c26db013)

## How does it work?
Works on client-server model. It listens for incoming requests from clients, processes those requests, and returns appropriate responses.

Here's a brief overview of how it works:
- **Initialization**: The server initializes necessary components, such as setting up sockets and configuring network settings.
- **Listening for Requests**: The server listens on a specified port for incoming HTTP requests from clients.
- **Handling Requests**: When a request is received, the server parses the request to determine the action to be taken.
- **Processing**: Depending on the type of request (e.g., GET, POST), the server may retrieve files, execute scripts, or perform other tasks.
- **Generating Response**: After processing the request, the server generates an appropriate HTTP response, including headers and content.
- **Sending Response**: Finally, the server sends the response back to the client that made the request.

## How Server is Working?
The server is implemented in C language using sockets and low-level networking APIs. It utilizes TCP/IP protocols for communication over the internet.

Key components and functionalities of the server include:
- **Socket Programming**: The server creates and manages sockets for establishing connections with clients.
- **HTTP Protocol Handling**: It processes HTTP requests and generates corresponding HTTP responses.
- **File Handling**: The server reads and serves static files (e.g., HTML, CSS, JavaScript) requested by clients.
- **Static Content Generation**: Optionally, the server may support dynamic content generation using server-side scripting languages like PHP, Python, or others.

## Getting Started
To run the web server, follow these steps:
1. Clone or download this repository to your local machine.
2. Compile the source code using a C compiler (e.g. GCC).
3. Run the compiled executable specifying the desired port number (e.g., ./webserver 8080).
   
![web_server_in_c](https://github.com/massifcoder/webserver_in_c/assets/81623465/118b4b1d-b852-4062-8d5a-00a42ad0d1c0)

## Contributing
Contributions are welcome! If you'd like to contribute to this project, please fork the repository and submit a pull request with your changes.

## License
This project is licensed under the MIT License. Feel free to use, modify, and distribute it as per the terms of the license.
