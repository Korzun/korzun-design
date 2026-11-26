# Red flags: document-component

Each thought below made an earlier run fail review. When you notice one, stop
and do what the right column says.

| Thought | Reality | Do instead |
|---|---|---|
| "It's just the crop." | The shot is the frame exactly as a reader sees it; nothing is cropped. An overlay cut at the edge is cut for the reader too. | Fix the example, or report a gallery defect with the shot path. |
| "Same component as an example I already shot." | Each example places the trigger differently (in a Card, on a page, near the bottom), so each opens differently. | One overlay shot per example that contains an overlay. |
| "The script can't open this one." | It clicks any role by name, types, presses keys, and runs steps in order. | Write the steps (`--click "Open dialog" --click "Actions"`). If it truly cannot, the overlay table says why and what you checked by hand. |
| "The note is on the interface comment / in the example / in Usage, so it isn't lost." | A reader of the prop's row does not see it there. | Put every clause on the prop's own JSDoc; check it in that prop's generated row. |
| "The items are a shared constant, so a no-op handler is fine." | Choosing an item then does nothing visible; the demo looks broken. | Make the items a function of the setter, or move them inside the component, and show a readout. |
| "A similar example already covers the old `## Example`." | A reviewer checks the old snippet's props and item kinds one by one. | List them; one example contains all of them. |
| "The old prose says so, and I only edit what is wrong." | Old prose goes stale when a module it builds on changes. | Check each sentence against the changelog lines and the related docs before keeping it. |
| "Plain characters means ASCII." | It means typed characters instead of HTML entities. | Keep … – “ ” as written. |
| "It's only the description." | The description is inside the frame the shot shows. | Reshoot; the `find -newer` check must print nothing. |
| "The type comment already says what this prop does." | The merged union table, the one readers reach from `items`, shows no type paragraph. | Keep the clause on the prop's JSDoc. |
| "Setting `side="top"` (or a big `gap`) keeps it inside the demo." | Readers copy the prop for a reason no app has. | Write the example as an app would; report a clip as a gallery defect. |
| "The loading state shows for a moment after the click." | Nobody sees a 1.2 s state in a shot or a read. | Give it a toggle that holds it on, and shoot it. |
| "I only changed the example a little after the last shot." | Nobody has seen the final page. | Redo 6.1 to 6.5 and reshoot. |
| "(the default) helps the reader." | The Default column says it; prose repeats drift. | Leave defaults out of JSDoc, titles and descriptions. |
| "This JSDoc explains why the prop is named so." | Rationale and history are not behaviour. | Behaviour only, three sentences at most; link to a Usage section for more. |
| "The example shows the prop; the doc's advice is about real apps." | Readers copy examples. | Never demonstrate a use the docs advise against. |
| "The textbox has no name, so I can't shoot the invalid state." | `--type "textbox:…"` needs no name; it types into the first textbox (`textbox#2:…` for the second). | Type the invalid value and shoot it; `--press` keys land in the focused field. |
| "The component is hidden at desktop width, so its frame is empty; that's the gallery." | `@viewport mobile` renders the example at phone width. | Add the tag to the example's doc comment and reshoot. |
| "This note is about an inherited member, so I'll put it on a sibling prop." | A reader of that member's row never sees it, and the sibling's row says something about another prop. | `@member <name> <note>` on the type's own comment (step 2). |
| "The lone trigger stretches across the demo; that's the gallery." | A Button at the frame's root fills its width. | Wrap the trigger in `Inline`. |
| "The type isn't linked; I'll write the link to the other doc in the JSDoc." | The generator links a type whose table is in another migrated doc; an unmigrated one links once it is. | Leave the JSDoc as behaviour only. |
