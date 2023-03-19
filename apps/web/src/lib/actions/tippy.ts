import Tippy, { type Props } from "tippy.js";

export type TooltipProps = Partial<Props>;

const defaultParams: TooltipProps = {
	offset: [0, 4],
	placement: "bottom",
	animation: "shift-away-subtle",
	inertia: true,
};

export const tippy = (node: Element, p: TooltipProps = {}) => {
	const params = { ...defaultParams, ...p };
	// Determine the title to show. We want to prefer
	// 	the custom content passed in first, then the
	// HTML title attribute then the aria-label
	// in that order.
	const custom = params.content;
	const title = (node as HTMLElement).title;
	const label = node.getAttribute("aria-label");
	const content = custom || title || label;

	if (!content) return;

	// Let's make sure the "aria-label" attribute
	// is set so our element is accessible:
	// https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-label_attribute
	if (!label && content) node.setAttribute("aria-label", content.toString());

	// Clear out the HTML title attribute since
	// we don't want the default behavior of it
	// showing up on hover.
	(node as HTMLElement).title = "";

	// Support any of the Tippy props by forwarding all "params":
	// https://atomiks.github.io/tippyjs/v6/all-props/
	const tip = Tippy(node, { content, ...params });

	return {
		// If the props change, let's update the Tippy instance:
		update: (newParams: TooltipProps) => tip.setProps({ content, ...defaultParams, ...newParams }),

		// Clean up the Tippy instance on unmount:
		destroy: () => tip.destroy(),
	};
};
