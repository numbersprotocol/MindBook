//
//  SafariExtensionHandler.swift
//  MindBook Extension
//
//  Created by Sean Wu on 2019/7/14.
//  Copyright © 2019 DT42. All rights reserved.
//

import SafariServices

let userDefaults = UserDefaults.standard

class SafariExtensionHandler: SFSafariExtensionHandler {
    
    override func messageReceived(withName messageName: String, from page: SFSafariPage, userInfo: [String : Any]?) {
        // This method will be called when a content script provided by your extension calls safari.extension.dispatchMessage("message").
        page.getPropertiesWithCompletionHandler { properties in
            NSLog("The extension received a message (\(messageName)) from a script injected into (\(String(describing: properties?.url))) with userInfo (\(userInfo ?? [:]))")
        }
        
        if messageName == "save", let data = userInfo {
            NSLog("Saving \(data)")
            data.forEach {(key, value) in
                userDefaults.set(value, forKey: key)
            }
        } else if messageName == "load", let data = userInfo {
            NSLog("Loading \(data)")
            data.forEach {(key, _) in
                let value = userDefaults.object(forKey: key)
                NSLog("Loaded \(String(describing: value))")
                page.dispatchMessageToScript(withName: "loaded", userInfo: [key: value as Any])
            }
        }
    }
    
    override func toolbarItemClicked(in window: SFSafariWindow) {
        // This method will be called when your toolbar item is clicked.
        NSLog("The extension's toolbar item was clicked")
    }
    
    override func validateToolbarItem(in window: SFSafariWindow, validationHandler: @escaping ((Bool, String) -> Void)) {
        // This is called when Safari's state changed in some way that would require the extension's toolbar item to be validated again.
        validationHandler(true, "")
    }
    
    override func popoverViewController() -> SFSafariExtensionViewController {
        return SafariExtensionViewController.shared
    }
    
}
