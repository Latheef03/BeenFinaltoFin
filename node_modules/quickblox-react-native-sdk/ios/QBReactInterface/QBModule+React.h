//
//  QBModule+React.h
//  qb_ios_react_sdk
//
//  Created by Injoit on 17.01.2020.
//  Copyright © 2020 Injoit LTD. All rights reserved.
//

#if __has_include("RCTBridgeModule.h")
#import "RCTBridgeModule.h"
#import "RCTConvert.h"
#else
#import <React/RCTBridgeModule.h>
#import <React/RCTConvert.h>
#endif

#import "QBModule.h"

NS_ASSUME_NONNULL_BEGIN

@interface QBModule (React)

@end

NS_ASSUME_NONNULL_END
