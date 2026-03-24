type WorkAccordionItem = HTMLElement;
type WorkAccordionContent = HTMLDivElement;
type WorkAccordionTrigger = HTMLButtonElement;

const workItems: WorkAccordionItem[] = Array.from(document.querySelectorAll('.work-item'));

const setOpenState = (
  item: WorkAccordionItem,
  content: WorkAccordionContent,
  trigger: WorkAccordionTrigger,
  shouldOpen: boolean,
): void => {
  const inner = content.querySelector('.work-item__content-inner');
  if (!(inner instanceof HTMLDivElement)) return;

  content.hidden = false;
  const targetHeight = `${inner.offsetHeight}px`;

  if (shouldOpen) {
    item.classList.add('is-open');
    trigger.setAttribute('aria-expanded', 'true');
    content.style.height = '0px';

    requestAnimationFrame(() => {
      content.style.height = targetHeight;
    });

    const handleOpenEnd = (event: TransitionEvent): void => {
      if (event.propertyName !== 'height') return;
      content.style.height = 'auto';
      content.removeEventListener('transitionend', handleOpenEnd);
    };

    content.addEventListener('transitionend', handleOpenEnd);
    return;
  }

  content.style.height = `${inner.offsetHeight}px`;

  requestAnimationFrame(() => {
    item.classList.remove('is-open');
    trigger.setAttribute('aria-expanded', 'false');
    content.style.height = '0px';
  });

  const handleCloseEnd = (event: TransitionEvent): void => {
    if (event.propertyName !== 'height') return;
    content.hidden = true;
    content.removeEventListener('transitionend', handleCloseEnd);
  };

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
