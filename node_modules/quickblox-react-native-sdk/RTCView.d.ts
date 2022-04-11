/// <reference types="react-native" />
import * as React from 'react'

type RTCViewProps = {
  /**
   * Indicates whether the video specified by `userId` should be
   * mirrored during rendering. Commonly, applications choose to mirror the
   * user-facing camera.
   */
  mirror?: boolean
  sessionId: string
  userId: number
  style?: StyleProp<ViewStyle>
}
export default class RTCView extends React.Component<RTCViewProps> {}
