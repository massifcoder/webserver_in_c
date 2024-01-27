#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <arpa/inet.h>
#include <string.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <netdb.h>
#include <netinet/in.h>
#include <fcntl.h>

void error(const char *msg) {
    perror(msg);
    exit(1);
}

int main(int argc, char *argv[]) {
    printf("Starting server...\n");
    int sockfd, newsockfd, portno, n;
    struct sockaddr_in serv_addr, cli_addr;

    socklen_t clilen;
    char buffer[456];

    if (argc < 2) {
        fprintf(stderr, "Error, no port number given.\n");
        exit(1);
    }

    portno = atoi(argv[1]);
    printf("Listening over port number %d\n", portno);
    sockfd = socket(AF_INET, SOCK_STREAM, 0);

    if (sockfd < 0) {
        error("Error opening socket.\n");
    }

    memset(&serv_addr, 0, sizeof(serv_addr));

    serv_addr.sin_family = AF_INET;
    serv_addr.sin_addr.s_addr = inet_addr("127.0.0.1");
    serv_addr.sin_port = htons(portno);

    if (bind(sockfd, (struct sockaddr *)&serv_addr, sizeof(serv_addr)) < 0) {
        error("Binding failed!");
    }

    listen(sockfd, 5);

    while (1) {
        clilen = sizeof(cli_addr);
        newsockfd = accept(sockfd, (struct sockaddr *)&cli_addr, &clilen);

        if (newsockfd < 0) {
            error("Error in accepting the connection.\n");
        }

        memset(buffer, 0, sizeof(buffer));
        n = read(newsockfd, buffer, 455);

        if (n < 0) {
            error("Error on read.\n");
        }

        char method[16];

        char url[256];

        char http_version[16];
        sscanf(buffer, "%s %255s %s", method, url, http_version);
        
        printf("URL IS : %s\n",url);
        printf("Method is : %s\n",method);
        printf("Protocol IS : %s\n",http_version);        
        char file_name[256];

        if (strcmp(url, "/") == 0) {
            strcpy(file_name, "index.html");
            const char *response_header = "HTTP/1.1 200 OK\r\n"
                    "Content-Type: text/html\r\n"
                    "\r\n";
            write(newsockfd, response_header, strlen(response_header));
        } else if (strstr(url, "/index.js") == url) {
            strcpy(file_name, "frontend/index.js");
            const char *response_header = "HTTP/1.1 200 OK\r\n"
                     "Content-Type: application/javascript\r\n"
                     "\r\n";
            write(newsockfd, response_header, strlen(response_header));

        }
        else if(strstr(url, "/index.css") == url ){
            strcpy(file_name, "frontend/index.css");
            const char *response_header = "HTTP/1.1 200 OK\r\n"
                "Content-Type: text/css\r\n" // Set the Content-Type to CSS
                "\r\n";
            write(newsockfd, response_header, strlen(response_header));

        } else {
        // Remove the leading '/' from the URL
            if (*url == '/') {
                strcpy(file_name, url + 1);
            } else {
                strcpy(file_name, url);
            }
        }
        printf("File name: %s\n",file_name);
        int html_file = open(file_name, O_RDONLY);

        if (html_file < 0) {
            printf("%s is not found in directory.",file_name);
        }

        char response_buffer[1024];
        int bytes_read;

        while ((bytes_read = read(html_file, response_buffer, sizeof(response_buffer))) > 0) {
            write(newsockfd, response_buffer, bytes_read);
        }

        close(html_file);
        close(newsockfd);
        printf("Response send.");
    }

    close(sockfd);

    return 0;
}