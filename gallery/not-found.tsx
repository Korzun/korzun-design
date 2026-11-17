import { Link } from 'react-router';

import { stories } from './stories.js';

export const StoryNotFound = ({ id }: { id: string }) => (
  <div>
    <p>
      Story not found: <code>{id}</code>
    </p>
    <Link to={`/story/${stories[0].id}`}>Open the first story</Link>
  </div>
);
