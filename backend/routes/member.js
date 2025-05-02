const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Member = require('../models/Member');
const Gym = require('../models/Gym');
const EventLog = require('../models/EventLog');
const MembershipRequest = require('../models/MembershipRequest');

// Leave gym (Member only)
router.post('/leave-gym', authMiddleware, async (req, res) => {
    if (req.user.role !== 'member') {
        return res.status(403).json({ message: 'Access denied' });
    }

    try {
        const member = await Member.findById(req.user.id);
        if (!member || !member.gym) {
            return res.status(404).json({ message: 'Member not found or not in a gym' });
        }

        const gym = await Gym.findById(member.gym);
        if (!gym) {
            return res.status(404).json({ message: 'Gym not found' });
        }

        // Remove member from gym
        gym.members = gym.members.filter((id) => id.toString() !== req.user.id);
        await gym.save();

        // Clear gym and membership from member
        member.gym = undefined;
        member.membership = undefined;
        await member.save();

        // Log the leave gym event
        const eventLog = new EventLog({
            event: 'Leave Gym',
            page: '/member-dashboard',
            user: req.user.id,
            userModel: 'Member',
            details: `Member left gym ${gym.gymName}`,
        });
        await eventLog.save();

        res.json({ message: 'Left gym successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Request membership update (Member only)
router.post('/membership-request', authMiddleware, async (req, res) => {
    if (req.user.role !== 'member') {
        return res.status(403).json({ message: 'Access denied' });
    }

    const { requestedDuration } = req.body;

    if (!requestedDuration) {
        return res.status(400).json({ message: 'Requested duration is required' });
    }

    const validDurations = ['1 week', '1 month', '3 months', '6 months', '1 year'];
    if (!validDurations.includes(requestedDuration)) {
        return res.status(400).json({ message: 'Invalid membership duration' });
    }

    try {
        const member = await Member.findById(req.user.id);
        if (!member || !member.gym) {
            return res.status(404).json({ message: 'Member not found or not in a gym' });
        }

        const gym = await Gym.findById(member.gym);
        if (!gym) {
            return res.status(404).json({ message: 'Gym not found' });
        }

        const existingRequest = await MembershipRequest.findOne({
            member: req.user.id,
            gym: member.gym,
            status: 'pending',
        });
        if (existingRequest) {
            return res.status(400).json({ message: 'You already have a pending membership request' });
        }

        const membershipRequest = new MembershipRequest({
            member: req.user.id,
            gym: member.gym,
            requestedDuration,
        });

        await membershipRequest.save();

        // Log the membership request event
        const eventLog = new EventLog({
            event: 'Membership Request',
            page: '/membership-update',
            user: req.user.id,
            userModel: 'Member',
            details: `Member requested membership update to ${requestedDuration}`,
        });
        await eventLog.save();

        res.status(201).json({ message: 'Membership request sent', membershipRequest });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get membership requests for a Member
router.get('/membership-requests', authMiddleware, async (req, res) => {
    if (req.user.role !== 'member') {
        return res.status(403).json({ message: 'Access denied' });
    }

    try {
        const member = await Member.findById(req.user.id);
        if (!member || !member.gym) {
            return res.status(404).json({ message: 'Member not found or not in a gym' });
        }

        const membershipRequests = await MembershipRequest.find({ member: req.user.id })
            .populate('gym', 'gymName')
            .sort({ createdAt: -1 });

        res.json(membershipRequests);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;