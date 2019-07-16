//
//  KeywordViewController.swift
//  MindBook
//
//  Created by Sean Wu on 2019/7/16.
//  Copyright © 2019 DT42. All rights reserved.
//

import Cocoa

class KeywordViewController: NSViewController {
    var keywordData: [Int:[String:Any]] = [:]

    @IBOutlet weak var keywordTableView: NSTableView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do view setup here.
        loadKeywordData()
    }
    
    func loadKeywordData() {
        keywordData = [:]
        let kwcounter = userDefaults?.integer(forKey: "kwcounter") ?? 0
        for key in 0..<kwcounter {
            keywordData[key] = userDefaults?.dictionary(forKey: String(key))
        }
        NSLog("Loaded: \(keywordData)")
    }
    
    @IBAction func clearKeywordData(_ sender: NSButton) {
        NSLog(String(describing: userDefaults?.dictionaryRepresentation().keys.count))
        userDefaults?.removePersistentDomain(forName: "2AQULZDDCL.mindbook")
        userDefaults?.synchronize()
        NSLog(String(describing: userDefaults?.dictionaryRepresentation().keys.count))
        keywordData = [:]
    }
    
    @IBAction func dismissKeywordsView(_ sender: NSButton) {
        self.dismiss(self)
    }
}
