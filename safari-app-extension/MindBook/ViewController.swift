//
//  ViewController.swift
//  MindBook
//
//  Created by Sean Wu on 2019/7/14.
//  Copyright © 2019 DT42. All rights reserved.
//

import Cocoa
import SafariServices.SFSafariApplication

class ViewController: NSViewController {
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // Do any additional setup after loading the view.
    }
    
    override var representedObject: Any? {
        didSet {
            // Update the view, if already loaded.
        }
    }
    
    @IBAction func openSafariExtensionPrefereneces(_ sender: NSButton) {
        SFSafariApplication.showPreferencesForExtension(withIdentifier: "io.dt42.MindBook.MindBook-Extension") { error in
            if let _ = error {
                // Insert code to inform the user that something went wrong.
                NSLog("Error: \(String(describing: error))")
            }
        }
    }
    
    @IBAction func logData(_ sender: NSButton) {
        NSLog("log data called from app")
    }
    
    @IBAction func addAppData(_ sender: NSButton) {
        NSLog("add app data called")
    }
}
