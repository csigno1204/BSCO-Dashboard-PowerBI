// ============================================================================
// EXEMPLES DE REQUÊTES POWER QUERY (M) POUR BEXIO
// ============================================================================
// Ces requêtes peuvent être utilisées dans Power BI pour charger et
// transformer vos données Bexio
// ============================================================================

// ----------------------------------------------------------------------------
// REQUÊTE 1: Charger les factures depuis Excel
// ----------------------------------------------------------------------------
let
    Source = Excel.Workbook(File.Contents("C:\chemin\vers\bexio_data.xlsx"), null, true),
    Invoices_Sheet = Source{[Item="invoices",Kind="Sheet"]}[Data],
    #"Promoted Headers" = Table.PromoteHeaders(Invoices_Sheet, [PromoteAllScalars=true]),
    #"Changed Type" = Table.TransformColumnTypes(#"Promoted Headers",{
        {"InvoiceID", Int64.Type},
        {"InvoiceNumber", type text},
        {"Title", type text},
        {"ContactID", Int64.Type},
        {"InvoiceDate", type date},
        {"DueDate", type date},
        {"Total", type number},
        {"TotalGross", type number},
        {"TotalNet", type number},
        {"StatusID", Int64.Type}
    }),
    // Ajouter des colonnes calculées
    #"Added Month" = Table.AddColumn(#"Changed Type", "Month", each Date.Month([InvoiceDate]), Int64.Type),
    #"Added Year" = Table.AddColumn(#"Added Month", "Year", each Date.Year([InvoiceDate]), Int64.Type),
    #"Added Quarter" = Table.AddColumn(#"Added Year", "Quarter", each Date.QuarterOfYear([InvoiceDate]), Int64.Type),
    // Calculer les jours de retard
    #"Added Days Overdue" = Table.AddColumn(#"Added Quarter", "DaysOverdue",
        each Duration.Days(DateTime.LocalNow() - [DueDate]), Int64.Type)
in
    #"Added Days Overdue"


// ----------------------------------------------------------------------------
// REQUÊTE 2: Charger les contacts
// ----------------------------------------------------------------------------
let
    Source = Excel.Workbook(File.Contents("C:\chemin\vers\bexio_data.xlsx"), null, true),
    Contacts_Sheet = Source{[Item="contacts",Kind="Sheet"]}[Data],
    #"Promoted Headers" = Table.PromoteHeaders(Contacts_Sheet, [PromoteAllScalars=true]),
    #"Changed Type" = Table.TransformColumnTypes(#"Promoted Headers",{
        {"ContactID", Int64.Type},
        {"ContactNumber", type text},
        {"CompanyName", type text},
        {"ContactName", type text},
        {"Email", type text},
        {"City", type text},
        {"PostalCode", type text}
    })
in
    #"Changed Type"


// ----------------------------------------------------------------------------
// REQUÊTE 3: Charger les projets
// ----------------------------------------------------------------------------
let
    Source = Excel.Workbook(File.Contents("C:\chemin\vers\bexio_data.xlsx"), null, true),
    Projects_Sheet = Source{[Item="projects",Kind="Sheet"]}[Data],
    #"Promoted Headers" = Table.PromoteHeaders(Projects_Sheet, [PromoteAllScalars=true]),
    #"Changed Type" = Table.TransformColumnTypes(#"Promoted Headers",{
        {"ProjectID", Int64.Type},
        {"ProjectNumber", type text},
        {"ProjectName", type text},
        {"StartDate", type date},
        {"EndDate", type date},
        {"ContactID", Int64.Type},
        {"StateID", Int64.Type}
    }),
    // Calculer la durée du projet
    #"Added Duration" = Table.AddColumn(#"Changed Type", "ProjectDurationDays",
        each if [EndDate] <> null and [StartDate] <> null
             then Duration.Days([EndDate] - [StartDate])
             else null,
        Int64.Type)
in
    #"Added Duration"


// ----------------------------------------------------------------------------
// REQUÊTE 4: Table de calendrier (Date Dimension)
// ----------------------------------------------------------------------------
let
    // Définir la plage de dates
    StartDate = #date(2020, 1, 1),
    EndDate = #date(2030, 12, 31),

    // Créer la liste de dates
    DayCount = Duration.Days(Duration.From(EndDate - StartDate)) + 1,
    Source = List.Dates(StartDate, DayCount, #duration(1,0,0,0)),
    TableFromList = Table.FromList(Source, Splitter.SplitByNothing()),
    #"Changed Type" = Table.TransformColumnTypes(TableFromList,{{"Column1", type date}}),
    #"Renamed Columns" = Table.RenameColumns(#"Changed Type",{{"Column1", "Date"}}),

    // Ajouter des colonnes de date
    #"Added Year" = Table.AddColumn(#"Renamed Columns", "Year", each Date.Year([Date]), Int64.Type),
    #"Added Quarter" = Table.AddColumn(#"Added Year", "Quarter", each Date.QuarterOfYear([Date]), Int64.Type),
    #"Added Month" = Table.AddColumn(#"Added Quarter", "Month", each Date.Month([Date]), Int64.Type),
    #"Added Month Name" = Table.AddColumn(#"Added Month", "MonthName", each Date.MonthName([Date]), type text),
    #"Added Day" = Table.AddColumn(#"Added Month Name", "Day", each Date.Day([Date]), Int64.Type),
    #"Added Day of Week" = Table.AddColumn(#"Added Day", "DayOfWeek", each Date.DayOfWeek([Date]), Int64.Type),
    #"Added Day Name" = Table.AddColumn(#"Added Day of Week", "DayName", each Date.DayOfWeekName([Date]), type text),
    #"Added Week of Year" = Table.AddColumn(#"Added Day Name", "WeekOfYear", each Date.WeekOfYear([Date]), Int64.Type),

    // Ajouter des indicateurs
    #"Added Is Weekend" = Table.AddColumn(#"Added Week of Year", "IsWeekend",
        each if [DayOfWeek] = 6 or [DayOfWeek] = 0 then "Yes" else "No", type text),
    #"Added Year-Month" = Table.AddColumn(#"Added Is Weekend", "YearMonth",
        each Date.ToText([Date], "yyyy-MM"), type text),
    #"Added Year-Quarter" = Table.AddColumn(#"Added Year-Month", "YearQuarter",
        each Text.From([Year]) & "-Q" & Text.From([Quarter]), type text)
in
    #"Added Year-Quarter"


// ----------------------------------------------------------------------------
// REQUÊTE 5: Jointure Factures + Contacts
// ----------------------------------------------------------------------------
let
    // Charger les factures
    Invoices = Excel.Workbook(File.Contents("C:\chemin\vers\bexio_data.xlsx"), null, true),
    Invoices_Data = Invoices{[Item="invoices",Kind="Sheet"]}[Data],
    Invoices_Table = Table.PromoteHeaders(Invoices_Data, [PromoteAllScalars=true]),

    // Charger les contacts
    Contacts = Excel.Workbook(File.Contents("C:\chemin\vers\bexio_data.xlsx"), null, true),
    Contacts_Data = Contacts{[Item="contacts",Kind="Sheet"]}[Data],
    Contacts_Table = Table.PromoteHeaders(Contacts_Data, [PromoteAllScalars=true]),

    // Joindre les tables
    Merged = Table.NestedJoin(
        Invoices_Table, {"ContactID"},
        Contacts_Table, {"ContactID"},
        "Contact",
        JoinKind.LeftOuter
    ),

    // Développer les colonnes du contact
    Expanded = Table.ExpandTableColumn(
        Merged,
        "Contact",
        {"CompanyName", "ContactName", "Email", "City"},
        {"CompanyName", "ContactName", "Email", "City"}
    )
in
    Expanded


// ----------------------------------------------------------------------------
// REQUÊTE 6: Métriques calculées (KPIs)
// ----------------------------------------------------------------------------
let
    Source = Excel.Workbook(File.Contents("C:\chemin\vers\bexio_data.xlsx"), null, true),
    Invoices_Sheet = Source{[Item="invoices",Kind="Sheet"]}[Data],
    #"Promoted Headers" = Table.PromoteHeaders(Invoices_Sheet, [PromoteAllScalars=true]),

    // Filtrer les factures de l'année en cours
    CurrentYear = Date.Year(DateTime.LocalNow()),
    #"Filtered Year" = Table.SelectRows(#"Promoted Headers",
        each Date.Year([InvoiceDate]) = CurrentYear),

    // Grouper par mois et calculer les métriques
    #"Grouped by Month" = Table.Group(
        #"Filtered Year",
        {"Month"},
        {
            {"Revenue", each List.Sum([Total]), type number},
            {"InvoiceCount", each Table.RowCount(_), Int64.Type},
            {"AverageInvoiceValue", each List.Average([Total]), type number},
            {"MaxInvoice", each List.Max([Total]), type number},
            {"MinInvoice", each List.Min([Total]), type number}
        }
    )
in
    #"Grouped by Month"


// ----------------------------------------------------------------------------
// REQUÊTE 7: Actualisation automatique depuis le dossier
// ----------------------------------------------------------------------------
// Cette requête charge automatiquement le fichier Excel le plus récent
let
    Source = Folder.Files("C:\chemin\vers\data"),
    #"Filtered Rows" = Table.SelectRows(Source,
        each Text.Contains([Name], "bexio_data") and Text.EndsWith([Name], ".xlsx")),
    #"Sorted Rows" = Table.Sort(#"Filtered Rows",{{"Date modified", Order.Descending}}),
    #"Kept First Rows" = Table.FirstN(#"Sorted Rows",1),
    #"Latest File" = #"Kept First Rows"{0}[Content],
    #"Imported Excel" = Excel.Workbook(#"Latest File", null, true)
in
    #"Imported Excel"


// ============================================================================
// NOTES D'UTILISATION:
// ============================================================================
// 1. Remplacez "C:\chemin\vers\bexio_data.xlsx" par le chemin réel de votre fichier
// 2. Dans Power BI, allez dans "Transformer les données" → "Éditeur avancé"
// 3. Copiez-collez la requête souhaitée
// 4. Ajustez les noms de colonnes selon votre structure de données
// 5. Créez des relations entre les tables via l'onglet "Modèle"
// ============================================================================
