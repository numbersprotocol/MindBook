//
//  SafariExtensionViewController.swift
//  MindBook Extension
//
//  Created by Sean Wu on 2019/7/14.
//  Copyright © 2019 DT42. All rights reserved.
//

import SafariServices

class SafariExtensionViewController: SFSafariExtensionViewController {
    
    static let shared: SafariExtensionViewController = {
        let shared = SafariExtensionViewController()
        shared.preferredContentSize = NSSize(width:320, height:240)
        return shared
    }()
    
    @IBAction func logData(_ sender: NSButton) {
        let kwcounter = userDefaults?.integer(forKey: "kwcounter") ?? 0
        for key in 0..<kwcounter {
            NSLog("\(String(describing: userDefaults?.object(forKey: String(key))))")
        }
    }
}
