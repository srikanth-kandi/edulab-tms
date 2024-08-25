import AppDataSource from "../data-source.js";
import Organization from "../entity/Organization.js";

const organizationRepository = AppDataSource.getRepository(Organization);

// Update organization name
export async function updateOrg(req, res) {
  const { name } = req.body;

  try {
    // only admin can update organization
    if (req.userRole !== "admin") {
      return res.status(403).json({
        message: "Unauthorized to update organization",
      });
    }
    const organization = await organizationRepository.findOne({
      where: { id: req.userOrgId },
    });
    organization.name = name;
    organization.updatedAt = new Date();

    await organizationRepository.save(organization);

    res.status(200).json({
      id: organization.id,
      name: organization.name,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}
