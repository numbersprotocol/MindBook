//
//  ViewController.swift
//  MindBook
//
//  Created by Sean Wu on 2019/7/14.
//  Copyright © 2019 DT42. All rights reserved.
//

import Cocoa

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
    
    @IBAction func logData(_ sender: NSButton) {
        NSLog("log data called from app")
    }
    
    @IBAction func addAppData(_ sender: NSButton) {
        NSLog("add app data called")
    }
}
