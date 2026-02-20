class Highlight {
    constructor() {
        this._points = [];
    }

    destroy() {
        this._points = [];
    }

    show(points, opacity) {
        const arrayPoints = [].concat(points);
        this.hide();

        for (let i = 0; i < arrayPoints.length; i++) {
            const point = arrayPoints[i];
            if (point && point.toggleHighlight && point.hasHighlight()) {
                this.togglePointHighlight(point, true, opacity);
                this._points.push(point);
            }
        }
    }

    togglePointHighlight(point, show, opacity) {
        const toggleHandler = (point.options.highlight || {}).toggle;
        const highlight = point.options.highlight || {};
        const pointInactiveOpacity = opacity !== undefined ? opacity : highlight.inactiveOpacity;
        if (toggleHandler) {
            const eventArgs = {
                category: point.category,
                series: point.series,
                dataItem: point.dataItem,
                value: point.value,
                stackValue: point.stackValue,
                preventDefault: preventDefault,
                visual: point.highlightVisual(),
                show: show
            };
            toggleHandler(eventArgs);
            if (!eventArgs._defaultPrevented) {
                point.toggleHighlight(show, pointInactiveOpacity);
            }
        } else {
            point.toggleHighlight(show, pointInactiveOpacity);
        }
    }

    hide() {
        const points = this._points;
        while (points.length) {
            const point = points.pop();
            const highlight = point.options.highlight || {};
            this.togglePointHighlight(point, false, highlight.inactiveOpacity);
        }
    }

    isHighlighted(element) {
        const points = this._points;

        for (let i = 0; i < points.length; i++) {
            const point = points[i];
            if (element === point) {
                return true;
            }
        }

        return false;
    }
}

function preventDefault() {
    this._defaultPrevented = true;
}

export default Highlight;
