Here's what it looks like for today:

```js
import { DateSeparator } from './';
const data = require('../../docs/data.js');

const date = new Date();
<React.Fragment>
  <DateSeparator date={date} {...data.translationContext} />
  <DateSeparator date={date} position="center" {...data.translationContext} />
  <DateSeparator date={date} position="left" {...data.translationContext} />
</React.Fragment>;
```

And for a date in the past:

```js
import { DateSeparator } from './';
const data = require('../../docs/data.js');

const date = new Date('December 17, 1995 03:24:00');
<React.Fragment>
  <DateSeparator date={date} {...data.translationContext} />
  <DateSeparator date={date} position="center" {...data.translationContext} />
  <DateSeparator date={date} position="left" {...data.translationContext} />
</React.Fragment>;
```

Here's an example adding custom date formatting:

```js
import { DateSeparator } from './';
const data = require('../../docs/data.js');

const date = new Date('December 17, 1995 03:24:00');

function formatDate(d) {
  return <h2>Messages posted after {d.toDateString()}</h2>;
}

<React.Fragment>
  <DateSeparator
    formatDate={formatDate}
    date={date}
    {...data.translationContext}
  />
  <DateSeparator
    formatDate={formatDate}
    date={date}
    position="center"
    {...data.translationContext}
  />
  <DateSeparator
    formatDate={formatDate}
    date={date}
    position="left"
    {...data.translationContext}
  />
</React.Fragment>;
```
