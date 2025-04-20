from domain_reputation import DomainReputationChecker

checker = DomainReputationChecker()

test_url = "https://www.bbc.com"
reputatation_data = checker.check_domain_reputation(test_url)

print(reputatation_data)
