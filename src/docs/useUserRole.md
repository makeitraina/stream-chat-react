A custom hook to give you access to the message user role.

| Parameter | Type                                                     | Description                |
| --------- | -------------------------------------------------------- | -------------------------- |
| `message` | [object](https://getstream.io/chat/docs/javascript/message_format/?language=javascript) | The message to be handled |

It returns an object containing the roles of a user as boolean values.

| Returns                  | Type    | Description                                                                          |
| ------------------------ | ------- | ------------------------------------------------------------------------------------ |
| `roles`                  | object  | An object containing some role information regarding the message's user              |
| `roles.isMyMessage`      | boolean | A boolean that tells if the currently set user is the same as the message one        |
| `roles.isAdmin`          | boolean | A boolean that tells if the currently set user is an admin                           |
| `roles.isModerator`      | boolean | A boolean that tells if the currently set user is a moderator                        |
| `roles.isOwner`          | boolean | A boolean that tells if the currently set user is the owner                          |
| `roles.canEditMessage`   | boolean | A boolean that tells if the currently set user is able to edit the current message   |
| `roles.canDeleteMessage` | boolean | A boolean that tells if the currently set user is able to delete the current message |

```json
import { useUserRole } from '../components';
const MyCustomMessageComponent = (props) => {
  const {
    isMyMessage,
    isAdmin,
    isModerator,
    isOwner,
    canEditMessage,
    canDeleteMessage
  } = useUserRole(props.message);
  if (isMyMessage || isAdmin) {
    ...
  }
};
```
