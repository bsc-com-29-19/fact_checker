from domain_reputation import DomainReputationChecker

checker = DomainReputationChecker()

# Test with BBC URL
test_url = "https://www.google.com"
reputation_data = checker.check_domain_reputation(test_url)
print(reputation_data)

# Test with invalid URL
invalid_url = "not-a-valid-url"
print(checker.check_domain_reputation(invalid_url))  # Should return {"error": "Invalid URL"}

# Test with HTTPS URL without SSL
no_ssl_url = "http://example.com"  # Assuming this doesn't have SSL
print(checker.check_domain_reputation(no_ssl_url))