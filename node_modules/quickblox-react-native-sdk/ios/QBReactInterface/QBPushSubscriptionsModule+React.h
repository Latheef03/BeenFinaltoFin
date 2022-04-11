//
//  QBPushSubscriptionsModule+React.h
//  qb_ios_react_sdk
//
//  Created by Injoit on 17.01.2020.
//  Copyright © 2020 Injoit LTD. All rights reserved.
//

#if __has_include("RCTBridgeModule.h")
#import "RCTBridgeModule.h"
#else
#import <React/RCTBridgeModule.h>
#endif

#import "QBModule+React.h"
#import "QBPushSubscriptionsModule.h"

NS_ASSUME_NONNULL_BEGIN

@interface QBPushSubscriptionsModule (React) <RCTBridgeModule>

@end

NS_ASSUME_NONNULL_END
