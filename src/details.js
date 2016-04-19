import quadrant from './../quadrant';

function stylePopUp(parent, obj) {
  const el = obj;
  const parentBounds = parent.getBoundingClientRect();
  const elBounds = el.getBoundingClientRect();
  const quad = quadrant(parent);
  let top = parentBounds.top - elBounds.height / 2;
  let left = 0;
  if (quad === 1 || quad === 3) {
    if (parentBounds.top < 50) {
      top = parentBounds.top + elBounds.height / 2;
    }
    left = parentBounds.left + 40;
  } else if (quad === 2 || quad === 4) {
    if (window.innerHeight - parentBounds.bottom < 50) {
      top = parentBounds.top - elBounds.height * 1.5;
    }
    left = parentBounds.left - elBounds.width - 10;
  }
  el.style.position = 'absolute';
  el.style.border = 'solid 2px #D8D8D8';
  el.style.borderRadius = '5px';
  el.style.backgroundColor = 'whitesmoke';
  el.style.boxShadow = '0 0 1px 5000px rgba(0, 0, 0, 0.4)';
  el.style.padding = '15px 10px';
  el.style.zIndex = '99999999';
  el.style.top = `${top}px`;
  el.style.left = `${left}px`;
  return el;
}

function removePopUp() {
  const otherPopUps = document.getElementById('logix-tour-popup');
  if (otherPopUps) window.logixTourConfig.appendTarget.removeChild(otherPopUps);
}

function removePopUpAndClear(el, cb) {
  const otherPopUps = document.getElementById('logix-tour-popup');
  if (otherPopUps) window.logixTourConfig.appendTarget.removeChild(otherPopUps);
  window.logixTourConfig.appendTarget.removeChild(el);
  cb();
}

function buildDismiss(el) {
  if (window.logixTourConfig.dismiss) {
    const dismiss = document.createElement('div');
    dismiss.appendChild(document.createTextNode('don\'t show these again'));
    dismiss.style.textDecoration = 'underline';
    dismiss.style.color = 'blue';
    dismiss.style.cursor = 'pointer';
    dismiss.addEventListener('click', () => {
      window.logixTourConfig.dismiss();
    });
    el.appendChild(dismiss);
  }
}

function buildTitle(el, title) {
  if (title) {
    const titleText = document.createElement('div');
    titleText.appendChild(document.createTextNode(title));
    titleText.style.fontWeight = 'bold';
    titleText.style.marginBottom = '5px';
    el.appendChild(titleText);
  }
}

function buildContent(el, text) {
  const content = document.createTextNode(text);
  el.appendChild(content);
}

export default function addEvent(parent, el, title) {
  const text = parent.dataset.tourText || 'Now that I have your attention!';
  el.addEventListener('click', (e) => {
    removePopUp();
    let popUp = document.createElement('div');
    popUp.id = 'logix-tour-popup';
    buildTitle(popUp, title);
    buildContent(popUp, text);
    buildDismiss(popUp);
    window.logixTourConfig.appendTarget.appendChild(popUp);
    popUp.style.width = '250px';
    popUp.style.minHeight = '50px';
    popUp = stylePopUp(el, popUp);
    const removeThisPopUp = removePopUpAndClear.bind(this, el, () => {
      document.removeEventListener('click', removeThisPopUp);
    });
    document.addEventListener('click', removeThisPopUp);
    e.stopPropagation();
  });
  return el;
}
