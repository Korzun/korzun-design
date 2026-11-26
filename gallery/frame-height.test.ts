import { contentHeight, nextHeadroom, overlayTop } from './frame-height.js';

const rect = (top: number, height: number) =>
  ({ top, bottom: top + height, height, left: 0, right: 0, width: 0, x: 0, y: top }) as DOMRect;

const place = <T extends Element>(el: T, top: number, height: number): T => {
  el.getBoundingClientRect = () => rect(top, height);
  return el;
};

describe('contentHeight', () => {
  let wrapper: HTMLDivElement;
  beforeEach(() => {
    document.body.innerHTML = '<div id="root"><div id="flow"></div></div>';
    wrapper = place(document.getElementById('flow') as HTMLDivElement, 0, 100);
    wrapper.style.paddingBottom = '16px';
  });

  it('is the wrapper height when nothing is open', () => {
    expect(contentHeight(wrapper)).toBe(100);
  });

  it('reaches the bottom of a popover portalled to the body, plus the padding', () => {
    const popover = place(document.createElement('div'), 80, 200);
    document.body.append(popover);
    expect(contentHeight(wrapper)).toBe(80 + 200 + 16);
  });

  it('fits an open dialog with the padding above and below; a closed one is ignored', () => {
    const dialog = place(document.createElement('dialog'), 0, 300);
    wrapper.append(dialog);
    expect(contentHeight(wrapper)).toBe(100);
    dialog.setAttribute('open', '');
    expect(contentHeight(wrapper)).toBe(300 + 2 * 16);
  });

  it('reaches a fixed popover inside an open dialog', () => {
    const dialog = place(document.createElement('dialog'), 0, 50);
    dialog.setAttribute('open', '');
    const popover = place(document.createElement('div'), 200, 100);
    popover.style.position = 'fixed';
    dialog.append(popover);
    wrapper.append(dialog);
    expect(contentHeight(wrapper)).toBe(200 + 100 + 16);
  });

  it('adds the scroll offset, so a scrolled frame measures the same', () => {
    const popover = place(document.createElement('div'), 80, 200);
    document.body.append(popover);
    Object.defineProperty(window, 'scrollY', { value: 20, configurable: true });
    expect(contentHeight(wrapper)).toBe(20 + 80 + 200 + 16);
    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true });
  });
});

describe('contentHeight with a clamped modal dialog', () => {
  it('counts the content height, not the clamped box, plus the UA viewport gap', () => {
    document.body.innerHTML = '<div id="flow"></div>';
    const wrapper = document.getElementById('flow') as HTMLDivElement;
    wrapper.getBoundingClientRect = () => ({ height: 40, bottom: 40 }) as DOMRect;
    wrapper.style.paddingBottom = '16px';
    const dialog = document.createElement('dialog');
    dialog.setAttribute('open', '');
    // Clamped to a short viewport: the box is 42px, its content 162px.
    dialog.getBoundingClientRect = () => ({ top: 0, height: 42, bottom: 42 }) as DOMRect;
    Object.defineProperty(dialog, 'scrollHeight', { value: 162 });
    dialog.style.maxHeight = 'calc(100% - 38px)';
    wrapper.append(dialog);
    expect(contentHeight(wrapper)).toBe(162 + 38);
  });
});

describe('contentHeight with a top-anchored modal dialog', () => {
  it('reaches from the dialog top through its full height and bottom margin', () => {
    document.body.innerHTML = '<div id="flow"></div>';
    const wrapper = document.getElementById('flow') as HTMLDivElement;
    wrapper.getBoundingClientRect = () => ({ height: 40, bottom: 40 }) as DOMRect;
    wrapper.style.paddingBottom = '16px';
    const dialog = document.createElement('dialog');
    dialog.setAttribute('open', '');
    // The modal recipe: marginTop 100px, marginBottom 50px; clamped to 60px here.
    dialog.getBoundingClientRect = () => ({ top: 100, height: 60, bottom: 160 }) as DOMRect;
    Object.defineProperty(dialog, 'scrollHeight', { value: 162 });
    dialog.style.marginBottom = '50px';
    wrapper.append(dialog);
    expect(contentHeight(wrapper)).toBe(100 + 162 + 50);
  });
});

describe('overlayTop', () => {
  let wrapper: HTMLDivElement;
  beforeEach(() => {
    document.body.innerHTML = '<div id="root"><div id="flow"></div></div>';
    wrapper = place(document.getElementById('flow') as HTMLDivElement, 0, 100);
  });

  it('is null when nothing is open', () => {
    expect(overlayTop(wrapper)).toBeNull();
  });

  it('is the highest top of the overlays, above the wrapper too', () => {
    document.body.append(place(document.createElement('div'), 40, 100));
    document.body.append(place(document.createElement('div'), -60, 100));
    expect(overlayTop(wrapper)).toBe(-60);
  });

  it('counts a fixed popover inside an open dialog, not the dialog itself', () => {
    const dialog = place(document.createElement('dialog'), 0, 50);
    dialog.setAttribute('open', '');
    const popover = place(document.createElement('div'), -30, 100);
    popover.style.position = 'fixed';
    dialog.append(popover);
    wrapper.append(dialog);
    expect(overlayTop(wrapper)).toBe(-30);
  });
});

describe('nextHeadroom', () => {
  const none = { value: 0, staleTop: null };

  it('is zero while nothing is open, whatever it was', () => {
    expect(nextHeadroom(none, null, 24)).toEqual(none);
    expect(nextHeadroom({ value: 90, staleTop: null }, null, 24)).toEqual(none);
  });

  it('stays zero for an overlay that starts below the top padding', () => {
    expect(nextHeadroom(none, 24, 24)).toEqual(none);
    expect(nextHeadroom(none, 300, 24)).toEqual(none);
  });

  it('grows by what the overlay sticks out above the padding', () => {
    expect(nextHeadroom(none, -60, 24)).toEqual({ value: 84, staleTop: -60 });
  });

  it('waits while the overlay has not moved since the last growth', () => {
    const grown = { value: 84, staleTop: -60 };
    expect(nextHeadroom(grown, -60, 24)).toBe(grown);
  });

  it('keeps its value once the overlay has moved into the room', () => {
    expect(nextHeadroom({ value: 84, staleTop: -60 }, 24, 24)).toEqual({
      value: 84,
      staleTop: null,
    });
  });

  it('grows again for an overlay that moved only part of the way (a centred dialog)', () => {
    expect(nextHeadroom({ value: 84, staleTop: -60 }, -18, 24)).toEqual({
      value: 126,
      staleTop: -18,
    });
  });
});
