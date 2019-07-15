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
    
    @IBAction func addExtensionData(_ sender: NSButton) {
        NSLog("add extension data called")
    }
    
    @IBAction func logData(_ sender: NSButton) {
        NSLog("log data called from extension")
    }
}
