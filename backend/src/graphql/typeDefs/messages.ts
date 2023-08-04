// all the typeDefns that are related to a message

const messageTypeDefs = `#graphql

    type Message {
        id: String
        sender: User
        body: String
        createdAt: Date
    }
`;

export default messageTypeDefs;
