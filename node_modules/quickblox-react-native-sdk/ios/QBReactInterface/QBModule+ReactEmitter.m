//
//  QBModule+ReactEmitter.m
//  qb_ios_react_sdk
//
//  Created by Injoit on 21.01.2020.
//  Copyright © 2020 Injoit LTD. All rights reserved.
//

#if __has_include("RCTBridgeModule.h")
#import "RCTAssert.h"
#import "RCTUtils.h"
#import "RCTLog.h"

#else
#import <React/RCTAssert.h>
#import <React/RCTUtils.h>
#import <React/RCTLog.h>
#endif

#import <objc/runtime.h>

#import "QBModule+ReactEmitter.h"

static void *_qblistenerCount;
static void *_qbbridge;

@implementation QBModule (ReactEmitter)

- (NSInteger)listenerCount {
  NSNumber *result = objc_getAssociatedObject(self, &_qblistenerCount);
  return result.integerValue;
}

- (void)setListenerCount:(NSInteger)listenerCount {
  NSNumber *result = @(listenerCount);
  objc_setAssociatedObject(self,
                           &_qblistenerCount,
                           result,
                           OBJC_ASSOCIATION_RETAIN_NONATOMIC);
}

- (RCTBridge *)bridge {
  RCTBridge *result = objc_getAssociatedObject(self, &_qbbridge);
  return result;
}

- (void)setBridge:(RCTBridge *)bridge {
  objc_setAssociatedObject(self,
                           &_qbbridge,
                           bridge,
                           OBJC_ASSOCIATION_ASSIGN);
}

- (NSArray<NSString *> *)supportedEvents {
  NSMutableArray<NSString *>*supported = @[].mutableCopy;
  for (NSString *event in self.events) {
    [supported addObject:event(event)];
  }
  return supported;
}

- (NSDictionary *)eventsConstantsToExport {
  NSMutableDictionary *eventsConstants = @{}.mutableCopy;
  for (NSString *event in self.events) {
    eventsConstants[event] = event(event);
  }
  return @{ @"EVENT_TYPE": eventsConstants };
}

- (void)sendEventWithName:(NSString *)eventName body:(id)body
{
  RCTAssert(self.bridge != nil, @"Error when sending event: %@ with body: %@. "
            "Bridge is not set. This is probably because you've "
            "explicitly synthesized the bridge in %@, even though it's inherited "
            "from RCTEventEmitter.", eventName, body, [self class]);
  
  if (RCT_DEBUG && ![[self supportedEvents] containsObject:eventName]) {
    RCTLogError(@"`%@` is not a supported event type for %@. Supported events are: `%@`",
                eventName, [self class], [[self supportedEvents] componentsJoinedByString:@"`, `"]);
  }
  if (self.listenerCount > 0) {
    [self.bridge enqueueJSCall:@"RCTDeviceEventEmitter"
                        method:@"emit"
                          args:body ? @[eventName, body] : @[eventName]
                    completion:NULL];
  } else {
    RCTLogWarn(@"Sending `%@` with no listeners registered.", eventName);
  }
}

- (void)startObserving
{
  for (NSString *eventName in self.events) {
    [NSNotificationCenter.defaultCenter addObserver:self
                                           selector:@selector(didReceiveQBEventNotification:)
                                               name:sdkEvent(eventName)
                                             object:nil];
  }
}

- (void)stopObserving
{
  [NSNotificationCenter.defaultCenter removeObserver:self];
}

- (void)dealloc
{
  if (self.listenerCount > 0) {
    [self stopObserving];
  }
}

RCT_EXPORT_METHOD(addListener:(NSString *)eventName)
{
  if (RCT_DEBUG && ![[self supportedEvents] containsObject:eventName]) {
    RCTLogError(@"`%@` is not a supported event type for %@. Supported events are: `%@`",
                eventName, [self class], [[self supportedEvents] componentsJoinedByString:@"`, `"]);
  }
  self.listenerCount++;
  if (self.listenerCount == 1) {
    [self startObserving];
  }
  
}

RCT_EXPORT_METHOD(removeListeners:(double)count)
{
  int currentCount = (int)count;
  if (RCT_DEBUG && currentCount > self.listenerCount) {
    RCTLogError(@"Attempted to remove more %@ listeners than added", [self class]);
  }
  self.listenerCount = MAX(self.listenerCount - currentCount, 0);
  if (self.listenerCount == 0) {
    [self stopObserving];
  }
}

- (void)didReceiveQBEventNotification:(NSNotification *) notification {
  [self sendEventWithName:eventName(notification.name) body:notification.object];
}

@end
