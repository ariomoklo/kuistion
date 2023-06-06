
/**
 * Scrool HTML Element to Bottom
 *
 * @export
 * @param {HTMLElement} target
 * @param {ScrollBehavior} [behavior]
 */
export default function scrollChatBottom(target: HTMLElement, behavior?: ScrollBehavior): void {
    target.scrollTo({ top: target.scrollHeight, behavior });
}