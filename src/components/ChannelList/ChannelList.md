```js
import { ChannelList } from './ChannelList';
import { Chat } from '../';

const data = require('../../docs/data');
const filters = { type: 'team' };
const sort = {
  last_message_at: -1,
  cid: 1,
};
const options = {
  watch: true,
  limit: 3,
};
<div className="str-chat" style={{ height: 'unset' }}>
  <Chat client={data.client}>
    <ChannelList filters={filters} options={options} sort={sort} />
  </Chat>
</div>;
```
