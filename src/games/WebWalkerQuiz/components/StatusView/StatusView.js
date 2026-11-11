import { h } from '../../utils/dom.js';
import './StatusView.css';

/** Friendly loading / empty / error states. */
export function createStatusView({ t }) {
  const el = h('section', { class: 'ws-screen ws-status' });

  const render = ({ role, icon, title, body, action }) => {
    el.replaceChildren(
      h(
        'div',
        { class: 'ws-panel ws-status-card', role },
        h('div', { class: 'ws-status-icon', 'aria-hidden': 'true' }, icon),
        title && h('h2', { class: 'ws-status-title' }, title),
        body && h('p', {}, body),
        action,
      ),
    );
  };

  return {
    el,
    showLoading() {
      render({ role: 'status', icon: h('span', { class: 'ws-spinner' }), body: t('app.loading') });
    },
    showError(messageKey, onRetry) {
      render({
        role: 'alert',
        icon: '🛰️',
        title: t('app.errorTitle'),
        body: t(messageKey),
        action:
          onRetry &&
          h(
            'button',
            { class: 'ws-btn ws-btn--orange', type: 'button', onClick: onRetry },
            t('app.retry'),
          ),
      });
      el.querySelector('button')?.focus();
    },
    showEmpty(onBack) {
      render({
        role: 'status',
        icon: '🌌',
        title: t('app.emptyTitle'),
        body: t('app.emptyBody'),
        action:
          onBack &&
          h('button', { class: 'ws-btn', type: 'button', onClick: onBack }, t('app.retry')),
      });
    },
  };
}
