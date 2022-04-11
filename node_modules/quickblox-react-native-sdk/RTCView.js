import React from 'react'
import {
  findNodeHandle,
  NativeEventEmitter,
  NativeModules,
  requireNativeComponent,
  UIManager,
} from 'react-native'

const { RNQBWebRTCModule } = NativeModules

const View = requireNativeComponent('RNQBWebRTCView')

export default class WebRTCView extends React.Component {

  subscription = null

  componentDidMount() {
    const emitter = new NativeEventEmitter(RNQBWebRTCModule)
    this.subscription = emitter.addListener(
      RNQBWebRTCModule.EVENT_TYPE.RECEIVED_VIDEO_TRACK,
      this.play
    )
    const { sessionId, userId } = this.props
    if (sessionId && userId) {
      this.play({
        payload: { sessionId, userId }
      })
    }
  }

  componentWillUnmount() {
    this.subscription.remove()
  }

  play = (event = { payload: {} }) => {
    const { sessionId, userId } = event.payload
    if (userId === this.props.userId) {
      const reactTag = findNodeHandle(this)
      const { Commands } = UIManager.getViewManagerConfig('RNQBWebRTCView')
      if (reactTag && Commands) {
        UIManager.dispatchViewManagerCommand(
          reactTag,
          Commands.play,
          [ userId, sessionId ],
        )
      }
    }
  }

  render() {
    return <View {...this.props} />
  }

}
