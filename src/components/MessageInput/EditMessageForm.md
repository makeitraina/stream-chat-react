```js
import { EditMessageForm } from './EditMessageForm';
import { MessageInput } from './MessageInput';

import { Channel } from '../Channel/Channel';
import { Chat } from '../Chat/Chat';
import { MessageTeam } from '../Message/MessageTeam';


const StreamChat = require('stream-chat').StreamChat;

const chatClient = StreamChat.getInstance('qk4nn7rpcn75');

chatClient.connectUser(
  {
    id: 'John',
  },
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiSm9obiIsImlhdCI6MTU0ODI5ODUxN30.hyonbQnOLuFsr15mdmc_JF4sBOm2SURK4eBvTOx3ZIg',
);

const channel = chatClient.channel('team', 'docs', {
  image:
    'https://s3-us-west-2.amazonaws.com/s.cdpn.io/195612/chat_avatar_01_green.jpg',
  name: 'Talk about the documentation',
});

<Chat client={chatClient} Message={MessageTeam}>
  <Channel channel={channel}>
    <MessageInput Input={EditMessageForm} />
  </Channel>
</Chat>;
```
