/** Preview */
import { ToastProvider, useToast } from '@korzun/design/toast';
import { useEffect } from 'react';

// A toast leaves after a few seconds, so a fresh one replaces it just before it would go.
const Show = () => {
  const showToast = useToast();
  useEffect(() => {
    showToast('Password changed', 'success');
    const timer = setInterval(() => showToast('Password changed', 'success'), 3500);
    return () => clearInterval(timer);
  }, [showToast]);
  return null;
};

export default function Preview() {
  return (
    <ToastProvider maxToasts={1}>
      <Show />
    </ToastProvider>
  );
}
