//
//  QBModule+ReactEmitter.h
//  qb_ios_react_sdk
//
//  Created by Injoit on 21.01.2020.
//  Copyright © 2020 Injoit LTD. All rights reserved.
//

#import "QBModule+React.h"
#import <React/RCTBridge.h>

NS_ASSUME_NONNULL_BEGIN

@interface QBModule (ReactEmitter)

@property (nonatomic, weak) RCTBridge *bridge;

- (NSArray<NSString *> *)supportedEvents;
- (NSDictionary *)eventsConstantsToExport;

- (void)sendEventWithName:(NSString *)name body:(id)body;

- (void)addListener:(NSString *)eventName;
- (void)removeListeners:(double)count;

@end

NS_ASSUME_NONNULL_END
