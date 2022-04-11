//
//  QBChatModule+React.h
//  qb_ios_react_sdk
//
//  Created by Injoit on 20.01.2020.
//  Copyright © 2020 Injoit LTD. All rights reserved.
//

#import "QBModule+ReactEmitter.h"
#import "QBChatModule.h"

NS_ASSUME_NONNULL_BEGIN

@interface QBChatModule (React) <RCTBridgeModule>

+ (NSDictionary *)dialogType;

@end

NS_ASSUME_NONNULL_END
