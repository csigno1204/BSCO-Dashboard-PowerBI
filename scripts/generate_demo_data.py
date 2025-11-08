"""
Génère des données de démonstration pour tester le dashboard sans API Bexio
"""
import json
import os
from datetime import datetime, timedelta
import random


def generate_contacts(count=50):
    """Génère des contacts de démonstration"""
    first_names = ["Jean", "Marie", "Pierre", "Sophie", "Luc", "Claire", "Thomas", "Emma",
                   "Nicolas", "Julie", "Marc", "Laura", "François", "Isabelle", "David"]
    last_names = ["Dupont", "Martin", "Bernard", "Dubois", "Laurent", "Simon", "Michel",
                  "Lefebvre", "Leroy", "Moreau", "Garcia", "David", "Bertrand", "Roux"]
    companies = ["Tech Solutions SA", "Digital Services", "Consulting Group", "Innovation Lab",
                 "Software Factory", "Cloud Systems", "Data Analytics", "Web Agency",
                 "Mobile Apps", "AI Research", "Cyber Security", "Network Solutions"]
    cities = ["Lausanne", "Genève", "Zurich", "Berne", "Bâle", "Neuchâtel", "Fribourg", "Sion"]

    contacts = []
    for i in range(1, count + 1):
        contact = {
            "id": i,
            "nr": f"C{i:05d}",
            "name_1": random.choice(companies) + f" {i}",
            "name_2": f"{random.choice(first_names)} {random.choice(last_names)}",
            "email": f"contact{i}@example.ch",
            "phone_fixed": f"+41 21 {random.randint(100, 999)} {random.randint(10, 99)} {random.randint(10, 99)}",
            "phone_mobile": f"+41 79 {random.randint(100, 999)} {random.randint(10, 99)} {random.randint(10, 99)}",
            "address": f"Rue Example {random.randint(1, 100)}",
            "postcode": f"{random.randint(1000, 9999)}",
            "city": random.choice(cities),
            "country_id": 1,
            "owner_id": random.randint(1, 5),
            "user_id": random.randint(1, 5)
        }
        contacts.append(contact)

    return contacts


def generate_invoices(contacts, count=200):
    """Génère des factures de démonstration"""
    statuses = [5, 5, 5, 9, 10, 10, 10, 10, 18]  # Weighted towards paid
    invoices = []

    for i in range(1, count + 1):
        invoice_date = datetime.now() - timedelta(days=random.randint(0, 365))
        due_date = invoice_date + timedelta(days=30)
        days_overdue = (datetime.now() - due_date).days if datetime.now() > due_date else 0

        total_net = random.randint(500, 50000)
        vat_rate = 0.077  # 7.7% TVA suisse
        total_gross = total_net * (1 + vat_rate)
        total = total_net

        invoice = {
            "id": i,
            "document_nr": f"RE-2024-{i:05d}",
            "title": f"Facture {random.choice(['Services', 'Développement', 'Consulting', 'Support', 'Maintenance'])}",
            "contact_id": random.choice([c["id"] for c in contacts]),
            "user_id": random.randint(1, 5),
            "project_id": random.randint(1, 20) if random.random() > 0.3 else None,
            "is_valid_from": invoice_date.strftime("%Y-%m-%d"),
            "is_valid_to": due_date.strftime("%Y-%m-%d"),
            "total_gross": round(total_gross, 2),
            "total_net": round(total_net, 2),
            "total": round(total, 2),
            "kb_item_status_id": random.choice(statuses),
            "currency_id": 1,
            "mwst_type": 0,
            "mwst_is_net": True
        }
        invoices.append(invoice)

    return invoices


def generate_quotes(contacts, count=80):
    """Génère des devis de démonstration"""
    statuses = [1, 2, 2, 2, 4, 4, 5, 6]  # Brouillon, En attente, Accepté, Refusé, Expiré
    quotes = []

    for i in range(1, count + 1):
        quote_date = datetime.now() - timedelta(days=random.randint(0, 180))
        valid_until = quote_date + timedelta(days=30)

        total = random.randint(1000, 100000)

        quote = {
            "id": i,
            "document_nr": f"AN-2024-{i:05d}",
            "title": f"Offre {random.choice(['Projet Web', 'Application Mobile', 'Système CRM', 'E-commerce', 'Intranet'])}",
            "contact_id": random.choice([c["id"] for c in contacts]),
            "user_id": random.randint(1, 5),
            "project_id": random.randint(1, 20) if random.random() > 0.5 else None,
            "is_valid_from": quote_date.strftime("%Y-%m-%d"),
            "is_valid_until": valid_until.strftime("%Y-%m-%d"),
            "total_gross": round(total * 1.077, 2),
            "total_net": round(total, 2),
            "total": round(total, 2),
            "kb_item_status_id": random.choice(statuses),
            "currency_id": 1
        }
        quotes.append(quote)

    return quotes


def generate_projects(contacts, count=20):
    """Génère des projets de démonstration"""
    project_names = [
        "Refonte Site Web", "Application Mobile iOS", "Système CRM", "E-commerce",
        "Intranet Entreprise", "API REST", "Dashboard Analytics", "Migration Cloud",
        "Application Android", "Portail Client", "Plateforme E-learning", "App IoT",
        "Système de Gestion", "Module RH", "Outil de Reporting", "Intégration ERP"
    ]

    states = [1, 1, 1, 1, 2, 2, 3]  # Actif, Archivé, Annulé
    projects = []

    for i in range(1, count + 1):
        start_date = datetime.now() - timedelta(days=random.randint(30, 365))
        duration = random.randint(30, 180)
        end_date = start_date + timedelta(days=duration)

        project = {
            "id": i,
            "nr": f"P-2024-{i:03d}",
            "name": f"{random.choice(project_names)} #{i}",
            "start_date": start_date.strftime("%Y-%m-%d"),
            "end_date": end_date.strftime("%Y-%m-%d") if random.random() > 0.3 else None,
            "contact_id": random.choice([c["id"] for c in contacts]),
            "pr_state_id": random.choice(states),
            "pr_project_type_id": random.randint(1, 3),
            "user_id": random.randint(1, 5)
        }
        projects.append(project)

    return projects


def generate_timesheets(projects, count=500):
    """Génère des feuilles de temps de démonstration"""
    timesheets = []

    for i in range(1, count + 1):
        date = datetime.now() - timedelta(days=random.randint(0, 90))
        duration_hours = random.choice([2, 4, 6, 8])
        duration_seconds = duration_hours * 3600

        timesheet = {
            "id": i,
            "user_id": random.randint(1, 5),
            "client_service_id": random.randint(1, 10),
            "contact_id": random.randint(1, 50),
            "pr_project_id": random.choice([p["id"] for p in projects]),
            "date": date.strftime("%Y-%m-%d"),
            "duration": duration_seconds,
            "text": f"Travail sur {random.choice(['développement', 'analyse', 'tests', 'documentation', 'réunion'])}",
            "status_id": 2,
            "allowable_bill": random.choice([True, True, True, False])
        }
        timesheets.append(timesheet)

    return timesheets


def generate_articles(count=30):
    """Génère des articles/services de démonstration"""
    services = [
        ("DEV-001", "Développement Web", "Développement de sites web et applications", 150),
        ("DEV-002", "Développement Mobile", "Applications iOS et Android", 180),
        ("CONS-001", "Consultation", "Consultation technique", 200),
        ("CONS-002", "Audit", "Audit de sécurité et performance", 220),
        ("SUP-001", "Support Niveau 1", "Support technique basique", 80),
        ("SUP-002", "Support Niveau 2", "Support technique avancé", 120),
        ("FORM-001", "Formation", "Formation utilisateurs", 100),
        ("MAINT-001", "Maintenance", "Maintenance préventive", 90),
        ("DESIGN-001", "Design UI/UX", "Conception d'interfaces", 160),
        ("TEST-001", "Tests", "Tests et validation", 130)
    ]

    articles = []
    for i, (code, name, desc, price) in enumerate(services, 1):
        article = {
            "id": i,
            "user_id": 1,
            "article_type_id": 1,
            "intern_code": code,
            "intern_name": name,
            "intern_description": desc,
            "purchase_price": 0.00,
            "sale_price": float(price),
            "purchase_total": 0.00,
            "sale_total": 0.00,
            "currency_id": 1,
            "tax_id": 1,
            "unit_id": 1
        }
        articles.append(article)

    return articles


def main():
    """Génère toutes les données de démonstration"""
    print("\n" + "="*70)
    print("  GÉNÉRATION DES DONNÉES DE DÉMONSTRATION")
    print("="*70 + "\n")

    output_dir = "data"
    os.makedirs(output_dir, exist_ok=True)
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')

    # Générer les données
    print("Génération des contacts...")
    contacts = generate_contacts(50)

    print("Génération des factures...")
    invoices = generate_invoices(contacts, 200)

    print("Génération des devis...")
    quotes = generate_quotes(contacts, 80)

    print("Génération des projets...")
    projects = generate_projects(contacts, 20)

    print("Génération des feuilles de temps...")
    timesheets = generate_timesheets(projects, 500)

    print("Génération des articles...")
    articles = generate_articles(30)

    # Sauvegarder en JSON
    data_sets = {
        'contacts': contacts,
        'invoices': invoices,
        'quotes': quotes,
        'projects': projects,
        'timesheets': timesheets,
        'articles': articles
    }

    for name, data in data_sets.items():
        filename = f"{output_dir}/{name}_{timestamp}.json"
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"✓ {len(data)} enregistrement(s) sauvegardé(s) dans {filename}")

    print("\n" + "="*70)
    print("✅ DONNÉES DE DÉMONSTRATION GÉNÉRÉES AVEC SUCCÈS!")
    print("="*70)
    print("\nProchaines étapes:")
    print("1. Transformez les données:")
    print("   python scripts/data_transformer.py")
    print("\n2. Importez le fichier Excel dans Power BI")
    print("\nNote: Ces données sont fictives et générées aléatoirement.")
    print()


if __name__ == '__main__':
    main()
