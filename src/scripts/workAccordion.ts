type WorkAccordionItem = HTMLElement;
type WorkAccordionContent = HTMLDivElement;
type WorkAccordionTrigger = HTMLButtonElement;
type WorkTransitionHandler = (event: TransitionEvent) => void;

const workItems: WorkAccordionItem[] = Array.from(document.querySelectorAll('.work-item'));
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const transitionHandlers = new WeakMap<WorkAccordionContent, WorkTransitionHandler>();

const clearTransitionHandler = (content: WorkAccordionContent): void => {
  const currentHandler = transitionHandlers.get(content);
  if (!currentHandler) return;

  content.removeEventListener('transitionend', currentHandler);
  transitionHandlers.delete(content);
};

const setAutoHeight = (content: WorkAccordionContent): void => {
  content.style.height = 'auto';
};

const setOpenState = (
  item: WorkAccordionItem,
  content: WorkAccordionContent,
  trigger: WorkAccordionTrigger,
  shouldOpen: boolean,
): void => {
  const inner = content.querySelector('.work-item__content-inner');
  if (!(inner instanceof HTMLDivElement)) return;

  clearTransitionHandler(content);
  content.hidden = false;

  if (shouldOpen) {
    item.classList.add('is-open');
    trigger.setAttribute('aria-expanded', 'true');
    content.style.height = '0px';
    const targetHeight = `${inner.offsetHeight}px`;

    if (prefersReducedMotion) {
      setAutoHeight(content);
      return;
    }

    requestAnimationFrame(() => {
      content.style.height = targetHeight;
    });

    const handleOpenEnd: WorkTransitionHandler = (event: TransitionEvent): void => {
      if (event.propertyName !== 'height') return;
      setAutoHeight(content);
      clearTransitionHandler(content);
    };

    transitionHandlers.set(content, handleOpenEnd);
    content.addEventListener('transitionend', handleOpenEnd);
    return;
  }

  content.style.height = `${inner.offsetHeight}px`;

  if (prefersReducedMotion) {
    item.classList.remove('is-open');
    trigger.setAttribute('aria-expanded', 'false');
    content.style.height = '0px';
    content.hidden = true;
    return;
  }

  requestAnimationFrame(() => {
    item.classList.remove('is-open');
    trigger.setAttribute('aria-expanded', 'false');
    content.style.height = '0px';
  });

  const handleCloseEnd: WorkTransitionHandler = (event: TransitionEvent): void => {
    if (event.propertyName !== 'height') return;
    content.hidden = true;
    clearTransitionHandler(content);
  };

  transitionHandlers.set(content, handleCloseEnd);
  content.addEventListener('transitionend', handleCloseEnd);
};

workItems.forEach((item: WorkAccordionItem) => {
  const trigger = item.querySelector('.work-item__summary');
  const content = item.querySelector('.work-item__content');

  if (!(trigger instanceof HTMLButtonElement) || !(content instanceof HTMLDivElement)) return;

  if (item.classList.contains('is-open')) {
    content.hidden = false;
    content.style.height = 'auto';
  } else {
    content.hidden = true;
    content.style.height = '0px';
  }

  trigger.addEventListener('click', () => {
    const isOpen = item.classList.contains('is-open');
    setOpenState(item, content, trigger, !isOpen);
  });
});
