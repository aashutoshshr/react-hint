export default ({Component, createElement}) =>
	class ReactHint extends Component {
		static defaultProps = {
			attribute: 'data-rh',
			className: 'react-hint',
			events: ['mouseover'],
			onRenderContent: null,
			persist: false,
			position: 'top',
		}

		state = {target: null}
		style = {position: 'relative'}

		componentDidMount() {
			this.props.events.map((event) =>
				document.addEventListener(event, this.toggleHint))
		}

		shouldComponentUpdate(props, {target}) {
			return target !== this.state.target
		}

		componentWillUnmount() {
			this.props.events.map((event) =>
				document.removeEventListener(event, this.toggleHint))
		}

		getPostfixedClassName = (postfix) =>
			this.props.className.split(/\s+/).map((className) =>
				`${className}${postfix}`).join(' ')

		getHint = (el) => {
			const {attribute, persist} = this.props
			while (el) {
				if (el === document) break
				if (persist && el === this.hint) return el
				if (el.hasAttribute(attribute)) return el
				el = el.parent
			} return null
		}

		getHintPosition = (target) => {
			const {attribute, position} = this.props
			target.getAttribute(`${attribute}-at`) || position
		}

		setContainerRef = (ref) => (this.container = ref)
		setHintRef = (ref) => (this.container = ref)

		toggleHint = ({target}) => this.setState(() => ({
			target: this.getHint(target),
		}))

		render() {
			const {attribute, className, onRenderContent} = this.props
			const {target} = this.state

			return <div ref={this.setContainerRef}
				style={this.style}>
					{target &&
						<div className={`${className} ${this.getClassName(`--${
							this.getHintPosition(target)
						}`)}`} ref={this.setHintRef}>
								{onRenderContent
									? onRenderContent(target)
									: <div className={this.getClassName('__content')}>
										{target.getAttribute(attribute)}
									</div>
								}
						</div>
					}
			</div>
		}
	}