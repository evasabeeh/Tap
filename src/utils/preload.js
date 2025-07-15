export function setupIdleCallback(task) {
    if ('requestIdleCallback' in window) {
        requestIdleCallback(task);
    } else {
        setTimeout(task, 2000);
    }
}
