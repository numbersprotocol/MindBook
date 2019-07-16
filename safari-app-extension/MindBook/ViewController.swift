//
//  ViewController.swift
//  MindBook
//
//  Created by Sean Wu on 2019/7/14.
//  Copyright © 2019 DT42. All rights reserved.
//

import Cocoa
import SafariServices.SFSafariApplication

let userDefaults = UserDefaults(suiteName: "2AQULZDDCL.mindbook")

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
        let kwcounter = userDefaults?.integer(forKey: "kwcounter") ?? 0
        for key in 0..<kwcounter {
            NSLog("\(String(describing: userDefaults?.object(forKey: String(key))))")
        }
    }
    
    @IBAction func clearUserDefaults(_ sender: NSButton) {
        print(Array((userDefaults?.dictionaryRepresentation().keys)!).count)
        userDefaults?.removePersistentDomain(forName: "2AQULZDDCL.mindbook")
        userDefaults?.synchronize()
        print(Array((userDefaults?.dictionaryRepresentation().keys)!).count)
    }
}
